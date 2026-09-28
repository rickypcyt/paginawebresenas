"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function BusinessRequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
    try {
      const response = await fetch(`/api/business-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo revisar la solicitud");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo revisar la solicitud");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <button type="button" onClick={() => review("approve")} disabled={loading !== null} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50">
          <Check className="h-3.5 w-3.5" /> {loading === "approve" ? "Aprobando…" : "Aprobar"}
        </button>
        <button type="button" onClick={() => review("reject")} disabled={loading !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--destructive)] transition hover:bg-[var(--muted)] disabled:opacity-50">
          <X className="h-3.5 w-3.5" /> {loading === "reject" ? "Rechazando…" : "Rechazar"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--destructive)]">{error}</p>}
    </div>
  );
}
