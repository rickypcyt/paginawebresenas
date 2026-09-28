import Link from "next/link";
import { AuthButton } from "../auth/AuthButton";
import { Logo } from "@/components/brand/Logo";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo size={22} />
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
