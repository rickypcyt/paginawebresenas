import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Prisma } from "@/src/generated/prisma/client";
import { awardAction } from "@/lib/gamification";
import { verifyScanToken } from "@/lib/nfc-scan";
import { getSession } from "@/lib/session";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

export async function GET() {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const reviews = await prisma.review.findMany({
    where: { userId: result.session.user.id },
    orderBy: { createdAt: "desc" },
    include: { business: true },
  });

  return NextResponse.json({ reviews, count: reviews.length });
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await getSession();
  const user = result?.user ?? null;

  // Último IP de la cadena: el añadido por el proxy confiable.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "anonymous";
  const limiterKey = `create-review:${user?.id ?? `guest:${ip}`}`;
  if (!rateLimit(limiterKey, 10, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
  const guestName = typeof body.guestName === "string" ? body.guestName.trim().slice(0, 80) : "";
  const content = typeof body.content === "string" ? body.content.trim().slice(0, 2000) : "";
  const rating = Number(body.rating);
  const businessId: string | undefined = body.businessId;
  const businessSlug: string | undefined = body.businessSlug;
  const nfcToken = typeof body.nfcToken === "string" ? body.nfcToken.trim() : "";
  const requestedEmployeeId = typeof body.employeeId === "string" ? body.employeeId : undefined;

  const finalTitle = title || content.slice(0, 60) || "Reseña";
  if (!content) {
    return NextResponse.json({ error: "La reseña no puede estar vacía" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "La puntuación debe ser entre 1 y 5" }, { status: 400 });
  }

  let resolvedBusinessId = businessId;
  if (!resolvedBusinessId && businessSlug) {
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      select: { id: true },
    });
    if (business) resolvedBusinessId = business.id;
  }

  if (!resolvedBusinessId) {
    return NextResponse.json(
      { error: "Debes seleccionar un negocio" },
      { status: 400 }
    );
  }

  const businessExists = await prisma.business.findUnique({
    where: { id: resolvedBusinessId },
    select: { id: true },
  });
  if (!businessExists) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  let nfcTag = null;
  let tagToken: string | null = null;
  let nfcScanHash: string | null = null;
  if (nfcToken) {
    // El tap genera un token firmado con caducidad; links compartidos/expirados fallan aquí
    const scan = verifyScanToken(nfcToken);
    if (!scan) {
      return NextResponse.json(
        { error: "El enlace NFC expiró. Acerca el teléfono al tag de nuevo." },
        { status: 403 }
      );
    }
    tagToken = scan.tagToken;
    // Cada token de tap solo puede producir una reseña (índice único en BD).
    nfcScanHash = createHash("sha256").update(nfcToken).digest("hex");
    nfcTag = await prisma.nfcTag.findUnique({
      where: { token: tagToken },
      select: { businessId: true, employeeId: true, active: true },
    });
    if (!nfcTag?.active || nfcTag.businessId !== resolvedBusinessId) {
      return NextResponse.json({ error: "NFC inválido o desactivado" }, { status: 403 });
    }
  }

  const employeeId = nfcTag?.employeeId ?? requestedEmployeeId;
  if (employeeId) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, businessId: resolvedBusinessId, active: true },
      select: { id: true },
    });
    if (!employee) {
      return NextResponse.json({ error: "La persona seleccionada no pertenece al negocio" }, { status: 400 });
    }
  }

  // Un usuario solo puede reseñar una vez cada negocio/empleado.
  if (user) {
    const duplicate = await prisma.review.findFirst({
      where: {
        userId: user.id,
        businessId: resolvedBusinessId,
        employeeId: employeeId ?? null,
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Ya publicaste una reseña aquí" }, { status: 409 });
    }
  }

  const previousReviews = await prisma.review.count({
    where: { businessId: resolvedBusinessId },
  });
  const userReviews = user
    ? await prisma.review.count({ where: { userId: user.id } })
    : 0;

  let visit = null;
  if (!nfcTag && user) {
    visit = await prisma.visit.findFirst({
      where: {
        userId: user.id,
        businessId: resolvedBusinessId,
        verification: { in: ["qr", "location"] },
        review: null,
        createdAt: { gte: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  let review;
  try {
    review = await prisma.review.create({
      data: {
        title: finalTitle,
        content,
        rating,
        userId: user?.id ?? null,
        guestName: user ? null : guestName || null,
        businessId: resolvedBusinessId,
        verification: nfcTag ? "nfc" : visit ? visit.verification : "none",
        visitId: visit?.id,
        employeeId,
        nfcScanHash,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya publicaste una reseña con este enlace" },
        { status: 409 }
      );
    }
    throw error;
  }

  if (nfcTag && tagToken) {
    await prisma.nfcTag.update({
      where: { token: tagToken },
      data: { scanCount: { increment: 1 } },
    });
  }

  if (user) {
    await awardAction(user.id, userReviews === 0 ? "first_review" : "review");
    if (previousReviews === 0) {
      await awardAction(user.id, "discover_business");
    }
  }

  return NextResponse.json({ review });
});
