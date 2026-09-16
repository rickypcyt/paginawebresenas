"use client";

import Link from "next/link";
import { useAuthModal } from "../auth/AuthModalProvider";

export function PublicNavbar() {
  const { open } = useAuthModal();

  const links = [
    { href: "/home", label: "Explorar" },
    { href: "/categories", label: "Categorías" },
    { href: "/business-requests", label: "Solicitar negocio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="flex h-16 w-full items-center gap-4 px-4 lg:px-8">
        <Link href="/home" className="shrink-0 text-xl font-extrabold tracking-tight text-[var(--primary)]">
          Descubre<span className="text-[var(--foreground)]">Local</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 overflow-x-auto sm:flex lg:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            href="/business-requests"
            className="hidden rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:bg-[var(--primary-dark)] sm:block"
          >
            Solicitar NFC para mi negocio
          </Link>
          <button
            onClick={open}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:bg-[var(--primary-dark)]"
          >
            Ir a la app
          </button>
        </div>
      </div>
    </header>
  );
}
