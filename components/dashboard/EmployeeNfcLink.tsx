"use client";

import { useState } from "react";
import { Copy, Check, Nfc } from "lucide-react";

interface EmployeeNfcLinkProps {
  employeeId: string;
  token: string | null;
}

export function EmployeeNfcLink({ employeeId, token: initialToken }: EmployeeNfcLinkProps) {
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/employees/${employeeId}/nfc-tag`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo generar el link");
        return;
      }
      setToken(data.token);
    } catch {
      setError("No se pudo generar el link");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/nfc/${token}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el link");
    }
  }

  if (!token) {
    return (
      <div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)] disabled:opacity-50"
        >
          <Nfc className="h-3.5 w-3.5" /> {loading ? "Generando…" : "Generar link NFC"}
        </button>
        {error && <p className="mt-2 text-xs text-[var(--destructive)]">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)]">
          /nfc/{token}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--destructive)]">{error}</p>}
    </div>
  );
}
