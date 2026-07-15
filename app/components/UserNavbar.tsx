"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

const topLinks = [
  { href: "/home", label: "🏠 Inicio" },
  { href: "/explore", label: "🔍 Explorar" },
  { href: "/offers", label: "🎁 Ofertas" },
  { href: "/business-requests", label: "📝 Solicitar negocio" },
  { href: "/favorites", label: "❤️ Guardados" },
];

const bottomLinks = [
  { href: "/home", label: "Inicio", icon: "🏠" },
  { href: "/explore", label: "Explorar", icon: "🔍" },
  { href: "/offers", label: "Ofertas", icon: "🎁" },
  { href: "/favorites", label: "Guardados", icon: "❤️" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

interface UserNavbarProps {
  initialUser?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export function UserNavbar({ initialUser }: UserNavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user ?? initialUser;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
        <div className="flex h-16 w-full items-center justify-between gap-4 px-4 lg:px-8">
          <Link href="/home" className="shrink-0 text-xl font-extrabold tracking-tight text-[var(--primary)]">
            Descubre<span className="text-[var(--foreground)]">Local</span>
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar />
          </div>

          <nav className="hidden shrink-0 items-center gap-4 lg:gap-5 xl:flex">
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)] hover:text-[var(--primary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/profile"
            className="hidden shrink-0 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 transition hover:border-[var(--primary)] hover:shadow-sm md:flex"
          >
            <span className="max-w-[120px] truncate text-sm font-medium text-[var(--foreground)]">
              {user?.name || "Tu cuenta"}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "👤"}
            </span>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="shrink-0 rounded p-2 text-[var(--foreground)] lg:hidden"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="border-t border-[var(--border)] px-4 pb-4 lg:hidden">
            <nav className="flex flex-col gap-3 pt-4">
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? "text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:text-[var(--primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white pb-safe md:hidden">
        <div className="flex w-full justify-around py-2">
          {bottomLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
