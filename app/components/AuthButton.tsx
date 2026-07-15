"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useAuthModal } from "./AuthModalProvider";

export function AuthButton({ variant = "solid" }: { variant?: "solid" | "outline" }) {
  const { data: session, isPending } = useSession();
  const { open } = useAuthModal();

  if (isPending) {
    return (
      <span className="text-sm text-[var(--muted-foreground)]">
        Cargando...
      </span>
    );
  }

  if (session) {
    return (
      <Link
        href="/home"
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)]"
      >
        Ir a la app
      </Link>
    );
  }

  const base =
    "rounded-lg px-4 py-2 text-sm font-semibold transition-colors";
  const styles =
    variant === "outline"
      ? "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-light)]"
      : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)]";

  return (
    <button onClick={open} className={`${base} ${styles}`}>
      Iniciar sesión
    </button>
  );
}
