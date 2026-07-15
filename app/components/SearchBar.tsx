"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--muted-foreground)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <div className="flex items-center rounded-2xl bg-white shadow-sm ring-1 ring-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--ring)]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar negocios, cafeterías, servicios..."
          className="w-full rounded-2xl border-0 bg-transparent py-3.5 pl-12 pr-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
        />
        <button
          type="submit"
          className="my-1.5 mr-1.5 shrink-0 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)]"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
