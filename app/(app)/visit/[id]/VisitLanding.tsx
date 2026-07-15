"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { StarRating } from "@/app/components/StarRating";
import { useAuthModal } from "@/app/components/AuthModalProvider";
import { useSession } from "@/lib/auth-client";

interface VisitLandingProps {
  business: {
    id: string;
    name: string;
    slug: string;
    address?: string | null;
    city?: string | null;
    description?: string | null;
    rating: number;
    reviewCount: number;
  };
  token: string;
  mode: string;
}

export function VisitLanding({ business, token, mode }: VisitLandingProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { open } = useAuthModal();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleConfirm() {
    if (!session?.user?.id) {
      open();
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await fetch(`/api/businesses/${business.id}/visits/qr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, mode }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setConfirmed(true);
      setMessage("Visita verificada. ¡Gracias por visitarnos!");
    } else {
      setMessage(data.error || "Error al verificar la visita");
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="mb-2 text-4xl">🎉</p>
        <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
          ¡Listo, {session?.user?.name}!
        </h2>
        <p className="mb-6 text-[var(--muted-foreground)]">
          Has verificado tu visita a <span className="font-medium text-[var(--foreground)]">{business.name}</span>.
          Ganaste puntos y desbloqueaste beneficios.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/business/${business.slug}/review`}
            className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            Dejar reseña
          </Link>
          <Link
            href={`/business/${business.slug}`}
            className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            Ver negocio
          </Link>
          <Link
            href="/offers"
            className="rounded-xl border border-[var(--border)] bg-white px-6 py-3 font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            Ver ofertas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10">
      <div className="mb-6 text-center">
        <p className="text-5xl">🏪</p>
        <h1 className="mt-3 text-2xl font-bold text-[var(--foreground)]">{business.name}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {business.address}
          {business.city && `, ${business.city}`}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
          <StarRating rating={business.rating} />
          <span>{business.rating.toFixed(1)}</span>
          <span>({business.reviewCount} reseñas)</span>
        </div>
        {business.description && (
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">{business.description}</p>
        )}
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--primary-light)] p-5 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">¡Gracias por visitarnos!</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Confirma tu visita y consigue:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-[var(--foreground)]">
          <li>⭐ +50 puntos</li>
          <li>🎁 Beneficios locales</li>
          <li>🏆 Progreso de explorador</li>
        </ul>
      </div>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Validando..." : session?.user?.id ? "Confirmar visita" : "Continuar para confirmar"}
      </button>

      {message && <p className="mt-3 text-center text-sm text-[var(--primary)]">{message}</p>}

      {!session?.user?.id && (
        <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
          Necesitas iniciar sesión para confirmar. Tus datos se usarán para recompensarte.
        </p>
      )}
    </div>
  );
}
