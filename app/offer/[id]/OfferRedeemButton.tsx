"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuthModal } from "@/app/components/AuthModalProvider";

export function OfferRedeemButton({
  offerId,
  redeemed: initialRedeemed,
}: {
  offerId: string;
  redeemed: boolean;
}) {
  const [redeemed, setRedeemed] = useState(initialRedeemed);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { open } = useAuthModal();

  async function handleRedeem() {
    if (!session) {
      open();
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/offers/${offerId}/redeem`, { method: "POST" });
    setLoading(false);
    if (res.ok) setRedeemed(true);
    else alert("Error al reclamar la oferta");
  }

  if (redeemed) {
    return (
      <button
        disabled
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-foreground)]"
      >
        ✅ Oferta reclamada
      </button>
    );
  }

  return (
    <button
      onClick={handleRedeem}
      disabled={loading}
      className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
    >
      {loading ? "Reclamando..." : "Reclamar oferta"}
    </button>
  );
}
