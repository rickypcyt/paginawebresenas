"use client";

import Link from "next/link";
import { useAuthModal } from "../auth/AuthModalProvider";
import { Logo } from "@/components/brand/Logo";

const NAV_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#beneficios", label: "Beneficios" },
  { href: "/#plataforma", label: "Plataforma" },
  { href: "/#precios", label: "Precios" },
];

export function PublicNavbar() {
  const { open } = useAuthModal();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo size={20} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => open("/dashboard")}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
          >
            Acceder
          </button>
        </div>
      </div>
    </header>
  );
}
