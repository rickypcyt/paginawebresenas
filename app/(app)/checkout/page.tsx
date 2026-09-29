import type { Metadata } from "next";
import Link from "next/link";
import { getCheckoutProduct } from "@/lib/checkout";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const product = getCheckoutProduct(params.product ?? params.plan);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">
          Producto no encontrado
        </h1>
        <p className="mb-6 text-[var(--muted-foreground)]">
          El producto o plan que buscas no existe.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Completa tu compra
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Revisa tu pedido y completa los datos. El pago se procesa de forma segura con PlacetoPay.
        </p>
      </div>

      <CheckoutForm product={product} />
    </div>
  );
}
