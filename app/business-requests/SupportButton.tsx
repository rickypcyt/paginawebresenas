"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SupportButtonProps {
  requestId: string;
  initialSupported: boolean;
  count: number;
}

export function SupportButton({ requestId, initialSupported, count }: SupportButtonProps) {
  const router = useRouter();
  const [supported, setSupported] = useState(initialSupported);
  const [supporters, setSupporters] = useState(count);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/business-requests/${requestId}/support`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setSupported(data.supported);
      setSupporters((prev) => (data.supported ? prev + 1 : Math.max(prev - 1, 0)));
      router.refresh();
    } else {
      alert("Debes iniciar sesión para apoyar una solicitud");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
        supported
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "border border-[var(--input)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]"
      }`}
    >
      {supported ? "✅ Apoyado" : "👍 Apoyar"} ({supporters})
    </button>
  );
}
