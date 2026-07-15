"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VerifyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    const res = await fetch(`/api/businesses/${id}/verify`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Error al verificar");
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
    >
      {loading ? "..." : "Verificar"}
    </button>
  );
}
