import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyQrToken } from "@/lib/verification";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse, RouteContext } from "@/lib/api-utils";

const RECENT_VISIT_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 h

export const POST = withErrorHandler(async (
  request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  const { id } = await params;

  if (!rateLimit(`visit-qr:${user.id}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  const business = await prisma.business.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "";
  const mode: string = body.mode ?? "day";

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const window = mode === "30s" ? "30s" : "day";
  if (!verifyQrToken(id, token, window)) {
    return NextResponse.json({ error: "QR inválido o expirado" }, { status: 403 });
  }

  // Idempotente: el mismo usuario no acumula visitas duplicadas en la ventana.
  const recent = await prisma.visit.findFirst({
    where: {
      userId: user.id,
      businessId: id,
      createdAt: { gte: new Date(Date.now() - RECENT_VISIT_WINDOW_MS) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return NextResponse.json({ visit: recent, message: "Visita ya registrada" });
  }

  const expiresAt =
    window === "30s"
      ? new Date(Date.now() + 30 * 1000)
      : new Date(new Date().setHours(24, 0, 0, 0));

  const visit = await prisma.visit.create({
    data: {
      userId: user.id,
      businessId: id,
      verification: "qr",
      token,
      expiresAt,
    },
  });

  return NextResponse.json({ visit, message: "Visita verificada por QR" });
});
