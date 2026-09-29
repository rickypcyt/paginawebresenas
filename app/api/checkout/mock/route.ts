import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { placetopayMockMode } from "@/lib/placetopay";
import { withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (req: NextRequest) => {
  if (!placetopayMockMode()) {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }

  const body = await req.json();
  const { reference, result } = body ?? {};

  if (!reference || !["approved", "rejected"].includes(result)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: result },
  });

  return NextResponse.json({ ok: true });
});
