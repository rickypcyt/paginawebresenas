import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyQrToken } from "@/lib/verification";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse, RouteContext } from "@/lib/api-utils";

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

  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "";
  const mode: string = body.mode ?? "day";

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  if (!verifyQrToken(id, token, mode === "30s" ? "30s" : "day")) {
    return NextResponse.json({ error: "QR inválido o expirado" }, { status: 403 });
  }

  const visit = await prisma.visit.create({
    data: {
      userId: user.id,
      businessId: id,
      verification: "qr",
      token,
    },
  });

  return NextResponse.json({ visit, message: "Visita verificada por QR" });
});
