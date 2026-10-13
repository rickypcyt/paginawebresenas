import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyNotificationSignature,
  mapPlacetopayStatus,
  canUpdatePaymentStatus,
} from "@/lib/placetopay";
import { withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (req: NextRequest) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !verifyNotificationSignature(body as Parameters<typeof verifyNotificationSignature>[0])
  ) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const { requestId, reference, status } = body as {
    requestId: number | string;
    reference?: string;
    status?: { status?: string };
  };

  const payment = await prisma.payment.findFirst({
    where: { requestId: String(requestId) },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Seguridad extra: la referencia de la notificación debe coincidir.
  if (reference && reference !== payment.reference) {
    return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
  }

  const nextStatus = mapPlacetopayStatus(status?.status);

  if (canUpdatePaymentStatus(payment.status, nextStatus)) {
    await prisma.payment.update({
      where: { id: payment.id, status: "pending" },
      data: { status: nextStatus },
    });
  }

  return NextResponse.json({ ok: true });
});
