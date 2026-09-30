"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronDown, UserRound } from "lucide-react";
import { updateUser } from "@/lib/auth-client";

interface BusinessOption {
  id: string;
  name: string;
  city: string | null;
}

export function JoinBusinessForm({ businesses, initialName }: { businesses: BusinessOption[]; initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [businessId, setBusinessId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = businesses.find((b) => b.id === businessId);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const trimmed = name.trim();
      if (trimmed && trimmed !== initialName) {
        await updateUser({ name: trimmed }).catch(() => {});
      }
      const response = await fetch("/api/employee-join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo enviar la solicitud");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
      <div>
        <label htmlFor="join-name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Tu nombre</label>
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            id="join-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={80}
            className="w-full rounded-xl border border-[var(--input)] bg-white py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
        </div>
        <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">Tomamos tu nombre de tu cuenta; corrígelo si es necesario.</p>
      </div>

      <div ref={dropdownRef} className="relative">
        <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">Selecciona tu empresa</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`relative flex w-full items-center gap-3 rounded-xl border bg-white py-3 pl-10 pr-10 text-left text-sm outline-none transition focus:border-[var(--primary)] ${open ? "border-[var(--primary)]" : "border-[var(--input)]"}`}
        >
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <span className={`min-w-0 flex-1 truncate ${selected ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
            {selected ? selected.name : "Elige un negocio…"}
          </span>
          <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-white p-1.5 shadow-lg"
          >
            {businesses.map((business) => {
              const isSelected = business.id === businessId;
              return (
                <li key={business.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => { setBusinessId(business.id); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${isSelected ? "bg-[var(--primary-light)] font-medium text-[var(--primary-dark)]" : "text-[var(--foreground)] hover:bg-[var(--muted)]"}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--primary-dark)]">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{business.name}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
            {businesses.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No hay negocios disponibles.</li>
            )}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      <button type="submit" disabled={!businessId || !name.trim() || loading} className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "Enviando solicitud…" : "Solicitar acceso como empleado"}
      </button>
      <p className="text-center text-xs leading-relaxed text-[var(--muted-foreground)]">No tendrás acceso al negocio hasta que nuestro equipo apruebe tu solicitud.</p>
    </form>
  );
}
