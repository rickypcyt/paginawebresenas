"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthButton } from "./AuthButton";
import { SearchBar } from "./SearchBar";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/home", label: "Explorar" },
    { href: "/categories", label: "Categorías" },
    { href: "/offers", label: "Ofertas" },
    { href: "/business-requests", label: "Solicitar negocio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/home" className="shrink-0 text-xl font-extrabold tracking-tight text-[var(--primary)]">
          Descubre<span className="text-[var(--foreground)]">Local</span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-4 lg:gap-5 xl:flex">
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

        <div className="hidden w-72 shrink-0 md:block lg:w-96 xl:w-[28rem]">
          <SearchBar />
        </div>

        <div className="hidden shrink-0 md:block">
          <AuthButton />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 rounded p-2 text-[var(--foreground)] xl:hidden"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] px-4 pb-4 xl:hidden">
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
