import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { awardAction } from "@/lib/gamification";
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
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;

  if (!rateLimit(`create-review:${user.id}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const rating = Number(body.rating);
  const businessId: string | undefined = body.businessId;
  const businessSlug: string | undefined = body.businessSlug;
  const nfcToken = typeof body.nfcToken === "string" ? body.nfcToken.trim() : "";
  const requestedEmployeeId = typeof body.employeeId === "string" ? body.employeeId : undefined;

  if (!title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
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

  let nfcTag = null;
  if (nfcToken) {
    nfcTag = await prisma.nfcTag.findUnique({
      where: { token: nfcToken },
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

  const previousReviews = await prisma.review.count({
    where: { businessId: resolvedBusinessId },
  });
  const userReviews = await prisma.review.count({
    where: { userId: user.id },
  });

  let visit = null;
  if (!nfcTag) {
    visit = await prisma.visit.findFirst({
      where: {
        userId: user.id,
        businessId: resolvedBusinessId,
        verification: "qr",
        review: null,
        createdAt: { gte: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const review = await prisma.review.create({
    data: {
      title,
      content,
      rating,
      userId: user.id,
      businessId: resolvedBusinessId,
      verification: nfcTag ? "nfc" : visit ? "qr" : "none",
      visitId: visit?.id,
      employeeId,
    },
  });

  if (nfcTag) {
    await prisma.nfcTag.update({
      where: { token: nfcToken },
      data: { scanCount: { increment: 1 } },
    });
  }

  await awardAction(user.id, userReviews === 0 ? "first_review" : "review");
  if (previousReviews === 0) {
    await awardAction(user.id, "discover_business");
  }

  return NextResponse.json({ review });
});
