import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

type Ctx = RouteContext<{ id: string }>;

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const payment = await prisma.payment.findUnique({ where: { id }, select: { status: true } });
  if (!payment) return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  if (payment.status !== "pending" && payment.status !== "approved") {
    return NextResponse.json(
      { error: "Solo se pueden eliminar pagos pendientes o aprobados" },
      { status: 400 }
    );
  }

  await prisma.payment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
