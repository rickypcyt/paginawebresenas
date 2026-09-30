import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyNotificationSignature,
  mapPlacetopayStatus,
} from "@/lib/placetopay";
import { withErrorHandler } from "@/lib/api-utils";
import type { PaymentStatus } from "@/src/generated/prisma";

// Estados terminales: una vez alcanzados no pueden retroceder a "pending".
const TERMINAL: ReadonlySet<PaymentStatus> = new Set([
  "approved",
  "rejected",
  "expired",
  "failed",
]);

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

  // Las notificaciones pueden llegar desordenadas: un pago terminal no vuelve a pending.
  if (TERMINAL.has(payment.status) && nextStatus === "pending") {
    return NextResponse.json({ ok: true });
  }

  if (payment.status !== nextStatus) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: nextStatus },
    });
  }

  return NextResponse.json({ ok: true });
});
