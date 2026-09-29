"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Check, ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = periods.find((p) => p.value === value) ?? periods[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function select(periodValue: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("period", periodValue);
    const base = pathname ?? "/dashboard";
    startTransition(() => router.push(`${base}?${params.toString()}`));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-[var(--primary)] disabled:opacity-60"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary-dark)]">
          <CalendarDays className="h-4 w-4" />
        </span>
        <span className="flex flex-col items-start">
          <span className="text-[10px] font-medium leading-none text-[var(--muted-foreground)]">
            Periodo
          </span>
          <span className="mt-1 text-xs font-semibold leading-none text-[var(--foreground)]">
            {current.label}
          </span>
        </span>
        {isPending ? (
          <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
        ) : (
          <ChevronDown
            className={`ml-1 h-3.5 w-3.5 text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          {periods.map((period) => (
            <button
              key={period.value}
              type="button"
              role="option"
              aria-selected={period.value === value}
              onClick={() => select(period.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                period.value === value
                  ? "bg-[var(--primary-light)] font-semibold text-[var(--primary-dark)]"
                  : "text-[var(--foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              {period.label}
              {period.value === value && (
                <Check className="h-4 w-4 shrink-0 text-[var(--primary-dark)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
