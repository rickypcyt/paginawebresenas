"use client";

import { LoginButton } from "@/app/components/LoginButton";

export function FavoritesLoginPrompt() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <p className="mb-4 text-[var(--foreground)]">
        Inicia sesión para ver tus favoritos.
      </p>
      <LoginButton className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]">
        Iniciar sesión
      </LoginButton>
    </div>
  );
}
