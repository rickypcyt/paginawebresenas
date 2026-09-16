"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search } from "lucide-react";

interface BusinessOption {
  id: string;
  name: string;
  city: string | null;
}

export function JoinBusinessForm({ businesses }: { businesses: BusinessOption[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    if (!query) return businesses;
    return businesses.filter((business) =>
      `${business.name} ${business.city || ""}`.toLocaleLowerCase("es").includes(query)
    );
  }, [businesses, search]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/employee-join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, jobTitle }),
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
        <label htmlFor="business-search" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Busca tu empresa</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            id="business-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre o ciudad"
            className="w-full rounded-xl border border-[var(--input)] bg-white py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {filteredBusinesses.map((business) => (
          <label key={business.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${businessId === business.id ? "border-[var(--primary)] bg-[var(--primary-light)]" : "border-[var(--border)] hover:bg-[var(--muted)]"}`}>
            <input
              type="radio"
              name="businessId"
              value={business.id}
              checked={businessId === business.id}
              onChange={() => setBusinessId(business.id)}
              className="sr-only"
            />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--primary-dark)]"><Building2 className="h-4 w-4" /></span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[var(--foreground)]">{business.name}</span>
              <span className="block text-xs text-[var(--muted-foreground)]">{business.city || "Ciudad no indicada"}</span>
            </span>
          </label>
        ))}
        {filteredBusinesses.length === 0 && <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No encontramos empresas con esa búsqueda.</p>}
      </div>

      <div>
        <label htmlFor="job-title" className="mb-2 block text-sm font-medium text-[var(--foreground)]">Cargo o función <span className="font-normal text-[var(--muted-foreground)]">(opcional)</span></label>
        <input
          id="job-title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          maxLength={80}
          placeholder="Ej. Mesero, vendedor, recepcionista"
          className="w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      <button type="submit" disabled={!businessId || loading} className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "Enviando solicitud…" : "Solicitar acceso como empleado"}
      </button>
      <p className="text-center text-xs leading-relaxed text-[var(--muted-foreground)]">No tendrás acceso al negocio hasta que el propietario apruebe tu solicitud.</p>
    </form>
  );
}
