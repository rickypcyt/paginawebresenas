import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyNotificationSignature,
  mapPlacetopayStatus,
} from "@/lib/placetopay";
import { withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  if (!verifyNotificationSignature(body)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { requestId: String(body.requestId) },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Seguridad extra: la referencia de la notificación debe coincidir.
  if (body.reference && body.reference !== payment.reference) {
    return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
  }

  const status = mapPlacetopayStatus(body.status?.status);
  if (payment.status !== status) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });
  }

  return NextResponse.json({ ok: true });
});
