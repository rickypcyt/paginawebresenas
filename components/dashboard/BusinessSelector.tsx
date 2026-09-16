"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, ChevronDown } from "lucide-react";

interface Business {
  id: string;
  name: string;
  city: string | null;
}

interface BusinessSelectorProps {
  businesses: Business[];
  selectedId?: string | null;
}

export function BusinessSelector({ businesses, selectedId }: BusinessSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selected = businesses.find((b) => b.id === selectedId) || businesses[0];

  return (
    <div className="relative flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
        <Building2 className="h-4 w-4" />
      </div>
      <div className="relative">
        <select
          value={selected?.id || ""}
          disabled={businesses.length === 0 || isPending}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            params.set("businessId", e.target.value);
            const base = pathname ?? "/dashboard";
            startTransition(() => {
              router.push(`${base}?${params.toString()}`);
            });
          }}
          className="appearance-none rounded-lg border border-[var(--border)] bg-white py-2 pl-3 pr-9 text-sm font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] disabled:opacity-50"
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} · {b.city || "Sin ciudad"}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
      </div>
      {isPending && (
        <span className="inline-flex h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
      )}
    </div>
  );
}
