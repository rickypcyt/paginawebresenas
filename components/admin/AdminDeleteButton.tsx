"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

export function AdminDeleteButton({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confirming) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setConfirming(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirming(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [confirming]);

  async function remove() {
    setConfirming(false);
    const row =
      rootRef.current?.closest<HTMLElement>("div.rounded-xl") ?? rootRef.current?.parentElement ?? null;
    if (row) row.style.display = "none";
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      if (row) row.style.display = "";
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Error al eliminar");
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setConfirming((v) => !v)}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 className="h-3 w-3" /> Eliminar
      </button>
      {confirming && (
        <div className="absolute right-0 top-full z-40 mt-1 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg">
          <span className="whitespace-nowrap text-xs font-medium text-[var(--foreground)]">¿Eliminar?</span>
          <button
            type="button"
            onClick={remove}
            className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-[var(--input)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
