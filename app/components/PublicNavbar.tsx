"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthButton } from "./AuthButton";
import { SearchBar } from "./SearchBar";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/explore", label: "Explorar" },
    { href: "/business-requests", label: "Solicitar" },
    { href: "/categories", label: "Categorías" },
    { href: "/offers", label: "Ofertas" },
    { href: "/how-it-works", label: "¿Cómo funciona?" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-[var(--primary)]">
          Logo
        </Link>

        <div className="hidden max-w-md flex-1 px-6 md:block">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <AuthButton />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded p-2 text-[var(--foreground)] md:hidden"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] px-4 pb-4 md:hidden">
          <div className="pt-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-3 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
