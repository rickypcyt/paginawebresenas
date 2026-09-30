"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Check, UserRound } from "lucide-react";

type NfcType = "A" | "B";

const TYPE_INFO: Record<NfcType, { name: string; icon: typeof Building2 }> = {
  A: { name: "Toque Público", icon: Building2 },
  B: { name: "Toque Personal", icon: UserRound },
};

const plans = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "Básico",
    employees: "1–5 empleados",
    tagPrice: "$20",
    monthly: "$19.99",
    featured: false,
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Negocio",
    employees: "6–10 empleados",
    tagPrice: "$15",
    monthly: "$29.99",
    featured: true,
  },
  {
    slug: "business-plus",
    name: "Business Plus",
    tagline: "Negocio Plus",
    employees: "11–20 empleados",
    tagPrice: "$12",
    monthly: "$49.99",
    featured: false,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    tagline: "Empresarial",
    employees: "21–50 empleados",
    tagPrice: "$10",
    monthly: "$79.99",
    featured: false,
  },
];

export function PricingSection() {
  const [type, setType] = useState<NfcType>("A");

  return (
    <>
      {/* Selector Tipo A / Tipo B */}
      <div className="mx-auto mb-10 grid w-fit grid-cols-2 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
        {(["A", "B"] as const).map((t) => {
          const active = t === type;
          const Icon = TYPE_INFO[t].icon;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              Tipo {t}
            </button>
          );
        })}
      </div>

      {type === "A" ? (
        /* Tipo A — compra única */
        <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">
            Google
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--foreground)]">
            Toque Público
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Para mesa, entrada o caja. El cliente acerca el teléfono y llega directo a dejar su reseña en Google.
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm text-[var(--foreground)]">
            {[
              "NFC tipo A con diseño de reseñas Google",
              "NFC + QR en la misma placa",
              "Panel de reseñas y taps por dispositivo",
              "Todos tus clientes llegan a Google por igual",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-3xl font-bold text-[var(--foreground)]">
            $40
            <span className="text-sm font-normal text-[var(--muted-foreground)]"> /unidad</span>
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Pago único · <span className="font-semibold text-[var(--foreground)]">sin mensualidad</span>
          </p>
          <Link
            href="/checkout?product=tag-a"
            className="mt-6 rounded-full bg-[var(--primary)] px-4 py-2.5 text-center text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
          >
            Comprar Tipo A
          </Link>
        </div>
      ) : (
        /* Tipo B — planes por tamaño de equipo */
        <PlanGrid />
      )}
    </>
  );
}

const planFeatures = [
  "NFC tipo B por empleado",
  "Panel y ranking interno",
  "Reseñas internas de clientes",
];

function PlanGrid() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-4 sm:p-6">
      <h3 className="mb-4 font-semibold text-[var(--foreground)]">Planes por tamaño de equipo</h3>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-3xl p-5 ${
              plan.featured
                ? "border-2 border-[var(--primary)] bg-[var(--card)] shadow-[var(--shadow-lg)]"
                : "border border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-4 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)]">
                Más popular
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {plan.tagline}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {plan.employees}
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--foreground)]">
              {planFeatures.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-3xl font-bold text-[var(--foreground)]">
              {plan.monthly}
              <span className="text-sm font-normal text-[var(--muted-foreground)]">/mes</span>
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Tag por empleado: <span className="font-semibold text-[var(--foreground)]">{plan.tagPrice}</span> (pago único)
            </p>
            <Link
              href={`/checkout?plan=${plan.slug}`}
              className={`mt-4 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                plan.featured
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)]"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              Comprar plan
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-4 text-center text-sm text-[var(--muted-foreground)]">
        ¿Más de 50 empleados?{" "}
        <Link href="/business-requests" className="font-semibold text-[var(--primary-dark)] hover:underline">
          Contacta con nosotros
        </Link>{" "}
        para un presupuesto a medida.
      </p>
    </div>
  );
}
