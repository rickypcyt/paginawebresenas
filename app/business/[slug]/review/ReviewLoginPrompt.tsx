"use client";

import { LoginButton } from "@/app/components/LoginButton";

export function ReviewLoginPrompt() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <p className="mb-2 text-4xl">✍️</p>
      <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Escribe una reseña</h2>
      <p className="mb-6 text-[var(--muted-foreground)]">
        Inicia sesión para compartir tu experiencia.
      </p>
      <LoginButton className="rounded-xl bg-[var(--primary)] px-6 py-2 font-semibold text-white hover:bg-[var(--primary-dark)]">
        Iniciar sesión
      </LoginButton>
    </div>
  );
}
