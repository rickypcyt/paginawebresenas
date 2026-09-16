import Link from "next/link";
import { AuthButton } from "../auth/AuthButton";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[var(--primary)]">
          Toque
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/business-requests"
            className="hidden rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:bg-[var(--primary-dark)] sm:block"
          >
            Solicitar NFCs
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
