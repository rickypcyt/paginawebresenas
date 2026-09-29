"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { CheckoutProduct } from "@/lib/checkout";

export function CheckoutForm({ product }: { product: CheckoutProduct }) {
  const isPlan = product.product !== "tag_a";
  const min = product.minEmployees ?? 1;
  const max = product.maxEmployees ?? 1;

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [quantity, setQuantity] = useState(min);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthly = product.monthly ?? 0;
  const tagPrice = product.tagPrice ?? 0;
  const total = isPlan ? monthly + quantity * tagPrice : product.amount ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.id,
          quantity,
          buyerName,
          buyerEmail,
          buyerPhone,
          businessName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.processUrl) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }

      window.location.href = data.processUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar el pago."
      );
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]";

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_380px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
      >
        <h2 className="mb-5 text-lg font-semibold text-[var(--foreground)]">
          Datos de facturación
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Nombre completo"
            required
            className={inputClass}
          />
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="Email de contacto"
            required
            className={inputClass}
          />
          <input
            type="tel"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            placeholder="Teléfono (opcional)"
            className={inputClass}
          />
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nombre del negocio"
            required
            className={inputClass}
          />
          {isPlan && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Número de empleados{" "}
                <span className="text-xs font-normal text-[var(--muted-foreground)]">
                  ({min}–{max} · ${tagPrice} por tag)
                </span>
              </span>
              <input
                type="number"
                min={min}
                max={max}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className={inputClass}
              />
            </label>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {loading ? "Redirigiendo a PlacetoPay…" : `Pagar $${total.toFixed(2)}`}
        </button>

        <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
          Al continuar serás redirigido a la pasarela segura de PlacetoPay.
        </p>
      </form>

      <aside className="h-fit rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">
          Tu pedido
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {product.description}
        </p>

        <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
          {isPlan ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Primer mes de servicio</span>
                <span className="font-medium text-[var(--foreground)]">${monthly.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">
                  {quantity} tag{quantity !== 1 ? "s" : ""} NFC × ${tagPrice}
                </span>
                <span className="font-medium text-[var(--foreground)]">
                  ${(quantity * tagPrice).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Tag NFC personalizado + envío</span>
              <span className="font-medium text-[var(--foreground)]">${(product.amount ?? 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[var(--border)] pt-3">
            <span className="font-semibold text-[var(--foreground)]">Total</span>
            <span className="text-xl font-bold text-[var(--foreground)]">
              ${total.toFixed(2)} USD
            </span>
          </div>
          {isPlan && (
            <p className="pt-1 text-xs text-[var(--muted-foreground)]">
              Luego ${monthly.toFixed(2)}/mes. Los tags incluyen personalización y envío.
            </p>
          )}
        </div>

        <p className="mt-5 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--primary-dark)]" />
          Pago procesado por PlacetoPay. Tarjetas, transferencias y billeteras.
        </p>
      </aside>
    </div>
  );
}
