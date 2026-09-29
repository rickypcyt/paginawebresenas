import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { placetopayMockMode } from "@/lib/placetopay";
import { MockGateway } from "./MockGateway";

export const metadata: Metadata = {
  title: "Pasarela de prueba",
  robots: { index: false },
};

export default async function MockCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!placetopayMockMode()) {
    return <p className="mx-auto max-w-lg px-4 py-16 text-center text-[var(--muted-foreground)]">Pasarela de prueba no disponible.</p>;
  }

  const payment = reference
    ? await prisma.payment.findUnique({ where: { reference } })
    : null;

  if (!payment || payment.status !== "pending") {
    return <p className="mx-auto max-w-lg px-4 py-16 text-center text-[var(--muted-foreground)]">Sesión de pago no válida o ya procesada.</p>;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <MockGateway
        reference={payment.reference}
        description={payment.description}
        amount={`$${Number(payment.amount).toFixed(2)} ${payment.currency}`}
        buyerEmail={payment.buyerEmail}
      />
    </div>
  );
}
