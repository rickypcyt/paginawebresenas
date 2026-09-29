"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, FlaskConical } from "lucide-react";

export function MockGateway({
  reference,
  description,
  amount,
  buyerEmail,
}: {
  reference: string;
  description: string;
  amount: string;
  buyerEmail: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function pay(result: "approved" | "rejected") {
    setLoading(true);
    await fetch("/api/checkout/mock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, result }),
    });
    router.push(`/checkout/confirmacion?reference=${reference}`);
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        <FlaskConical className="h-3.5 w-3.5" /> Pasarela simulada (desarrollo)
      </span>

      <div className="mt-6 rounded-2xl bg-white p-6 text-left shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
          <p className="text-sm font-semibold text-[var(--foreground)]">PlacetoPay · Checkout</p>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Referencia</span>
            <span className="font-mono text-[var(--foreground)]">{reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Descripción</span>
            <span className="text-right text-[var(--foreground)]">{description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Comprador</span>
            <span className="text-[var(--foreground)]">{buyerEmail}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-3">
            <span className="font-semibold text-[var(--foreground)]">Total</span>
            <span className="text-lg font-bold text-[var(--foreground)]">{amount}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => pay("approved")}
          disabled={loading}
          className="rounded-full bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          Aprobar pago
        </button>
        <button
          onClick={() => pay("rejected")}
          disabled={loading}
          className="rounded-full border border-red-300 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
