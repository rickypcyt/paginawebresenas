import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  querySession,
  mapPlacetopayStatus,
  placetopayMockMode,
} from "@/lib/placetopay";

export const metadata: Metadata = {
  title: "Confirmación de pago",
  robots: { index: false },
};

const STATUS_UI = {
  approved: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    title: "¡Pago aprobado!",
    text: "Recibimos tu pago correctamente. Nuestro equipo se pondrá en contacto contigo para coordinar la entrega y activación.",
  },
  pending: {
    icon: Clock,
    iconClass: "text-amber-500",
    title: "Pago en proceso",
    text: "Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.",
  },
  rejected: {
    icon: XCircle,
    iconClass: "text-[var(--destructive)]",
    title: "Pago rechazado",
    text: "El pago no pudo completarse. Puedes intentarlo de nuevo con otro medio de pago.",
  },
  expired: {
    icon: XCircle,
    iconClass: "text-[var(--destructive)]",
    title: "Sesión expirada",
    text: "La sesión de pago expiró. Inicia el proceso de nuevo para completar tu compra.",
  },
  failed: {
    icon: XCircle,
    iconClass: "text-[var(--destructive)]",
    title: "Error en el pago",
    text: "Ocurrió un error al procesar tu pago. Inténtalo de nuevo.",
  },
} as const;

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  const payment = reference
    ? await prisma.payment.findUnique({ where: { reference } })
    : null;

  // Al volver de la pasarela, consulta el estado real en PlacetoPay.
  if (payment && payment.status === "pending" && payment.requestId && !placetopayMockMode()) {
    try {
      const session = await querySession(payment.requestId);
      const fresh = mapPlacetopayStatus(
        session.status?.status ?? session.payment?.[0]?.status?.status
      );
      if (fresh !== payment.status) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: fresh },
        });
        payment.status = fresh;
      }
    } catch (error) {
      console.error("[Checkout] Error consultando sesión:", error);
    }
  }

  if (!payment) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">
          Pago no encontrado
        </h1>
        <p className="mb-6 text-[var(--muted-foreground)]">
          No encontramos un pago con esa referencia.
        </p>
        <Link href="/" className="font-semibold text-[var(--primary-dark)] hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const ui = STATUS_UI[payment.status];
  const Icon = ui.icon;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <Icon className={`mx-auto h-14 w-14 ${ui.iconClass}`} />
        <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
          {ui.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {ui.text}
        </p>

        <div className="mt-6 rounded-2xl bg-[var(--muted)] p-4 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Referencia</span>
            <span className="font-mono font-medium text-[var(--foreground)]">{payment.reference}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-[var(--muted-foreground)]">Producto</span>
            <span className="font-medium text-[var(--foreground)]">{payment.description}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-[var(--muted-foreground)]">Negocio</span>
            <span className="font-medium text-[var(--foreground)]">{payment.businessName}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-[var(--muted-foreground)]">Total</span>
            <span className="font-bold text-[var(--foreground)]">
              ${Number(payment.amount).toFixed(2)} {payment.currency}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
