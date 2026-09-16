"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";

interface PeriodSelectorProps {
  value: string;
}

const periods = [
  { value: "this-month", label: "Este mes" },
  { value: "last-month", label: "Mes anterior" },
  { value: "last-30-days", label: "Últimos 30 días" },
  { value: "all-time", label: "Todo el tiempo" },
];

export function PeriodSelector({ value }: PeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary-dark)]">
        <CalendarDays className="h-4 w-4" />
      </div>
      <div className="relative pr-1">
        <span className="pointer-events-none absolute left-2 top-0.5 text-[10px] font-medium leading-none text-[var(--muted-foreground)]">
          Periodo
        </span>
        <select
          value={value}
          disabled={isPending}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams?.toString() ?? "");
            params.set("period", e.target.value);
            const base = pathname ?? "/dashboard";
            startTransition(() => router.push(`${base}?${params.toString()}`));
          }}
          aria-label="Seleccionar periodo"
          className="appearance-none rounded-lg bg-transparent pb-1 pl-2 pr-7 pt-3 text-xs font-semibold text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary-light)] disabled:opacity-50"
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
      </div>
      {isPending && (
        <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
      )}
    </div>
  );
}
