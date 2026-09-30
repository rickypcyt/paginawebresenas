"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Logo } from "@/components/brand/Logo";
import { LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface UserNavbarProps {
  initialUser?: { name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;
}

export function UserNavbar({ initialUser }: UserNavbarProps) {
  const { data: session } = useSession();
  const user = { ...initialUser, ...session?.user };
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo size={20} />
        </Link>

        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
            >
              <ShieldCheck className="h-4 w-4 text-[var(--primary-dark)]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--secondary)] px-3 py-1.5 transition hover:bg-[var(--border)]"
          >
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-[var(--foreground)] sm:inline">
              {user?.name || "Tu cuenta"}
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] text-xs font-medium text-[var(--primary-foreground)]">
              {user?.name?.charAt(0).toUpperCase() || "👤"}
            </span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--destructive)] disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
