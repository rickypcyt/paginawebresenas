"use client";

import Link from "next/link";
import { useAuthModal } from "../auth/AuthModalProvider";

export function PublicNavbar() {
  const { open } = useAuthModal();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Toque
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/business-requests"
            className="hidden rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)] sm:block"
          >
            Solicitar NFCs
          </Link>
          <button
            onClick={() => open("/dashboard")}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
          >
            Acceder a la app
          </button>
        </div>
      </div>
    </header>
  );
}
