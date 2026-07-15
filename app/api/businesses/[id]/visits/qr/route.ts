import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { verifyQrToken } from "@/lib/verification";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { token, mode = "day" } = await request.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  if (!verifyQrToken(id, token, mode === "30s" ? "30s" : "day")) {
    return NextResponse.json({ error: "QR inválido o expirado" }, { status: 403 });
  }

  const visit = await prisma.visit.create({
    data: {
      userId: session.user.id,
      businessId: id,
      verification: "qr",
      token,
    },
  });

  return NextResponse.json({ visit, message: "Visita verificada por QR" });
}
