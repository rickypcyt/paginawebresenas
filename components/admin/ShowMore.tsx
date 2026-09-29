"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ShowMore({ children, count }: { children: React.ReactNode; count: number }) {
  const [open, setOpen] = useState(false);
  if (count <= 0) return null;

  return (
    <>
      <div className={open ? "contents" : "hidden"}>{children}</div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      >
        {open ? (
          <>Mostrar menos <ChevronUp className="h-4 w-4" /></>
        ) : (
          <>Mostrar {count} más <ChevronDown className="h-4 w-4" /></>
        )}
      </button>
    </>
  );
}
