"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { isBusiness, isEmployee } from "@/lib/roles";
import { Logo } from "@/components/brand/Logo";
import { useState, useRef, useEffect } from "react";

const bottomLinks = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/explore", label: "Explorar", icon: "🔍" },
  { href: "/favorites", label: "Guardados", icon: "❤️" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

interface UserNavbarProps {
  initialUser?: { name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
}

export function UserNavbar({ initialUser }: UserNavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = { ...initialUser, ...session?.user };
  const role = (user as { role?: string | null })?.role;
  const menuLinks = [
    { href: "/profile", label: "Tu perfil" },
    ...(isBusiness(role) ? [{ href: "/dashboard", label: "Mi Toque · negocio" }] : []),
    ...(isEmployee(role) ? [{ href: "/employee", label: "Mi Toque · equipo" }] : []),
    ...(role === "user" ? [{ href: "/employee/join", label: "Unirme como empleado" }] : []),
    ...(isBusiness(role) ? [{ href: "/businesses/new", label: "Registrar negocio" }] : []),
  ];
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      window.location.assign("/");
    } catch {
      setIsSigningOut(false);
      alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Logo size={20} />
          </Link>

          <div className="flex items-center gap-3">
            {isBusiness(role) && (
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)] md:block"
              >
                Panel
              </Link>
            )}
            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--secondary)] px-3 py-1.5 transition hover:bg-[var(--border)]"
              >
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-[var(--foreground)] sm:inline">
                {user?.name || "Tu cuenta"}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] text-xs font-medium text-[var(--primary-foreground)]">
                {user?.name?.charAt(0).toUpperCase() || "👤"}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-2 shadow-[var(--shadow-lg)]">
                <div className="border-b border-[var(--border)] px-3 py-2">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{user?.name || "Tu cuenta"}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user?.email || ""}</p>
                </div>
                <nav className="flex flex-col py-1">
                  {menuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-[var(--border)] pt-1">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--destructive)] transition hover:bg-[var(--secondary)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSigningOut ? "Cerrando sesión…" : "Cerrar sesión"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)] pb-safe md:hidden">
        <div className="flex w-full justify-around py-2">
          {bottomLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  active
                    ? "text-[var(--foreground)]"
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
