"use client";

import { useState } from "react";
import { useAuthModal } from "./AuthModalProvider";
import { signIn } from "@/lib/auth-client";

export function LoginModal() {
  const { isOpen, redirectTo, close } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const callbackURL =
    redirectTo || (typeof window !== "undefined" ? window.location.href : "/");

  async function handleGoogleEmployeeLogin() {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signIn.social({ provider: "google", callbackURL: "/employee/join" });
      if (result?.error) {
        setError(result.error.message || "No se pudo iniciar sesión con Google");
        setGoogleLoading(false);
      }
    } catch {
      setError("No se pudo iniciar sesión con Google.");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL,
      });
      if (result.error) {
        setError(result.error.message || "Error al iniciar sesión");
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--foreground)]/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-8 shadow-2xl">
        <button
          onClick={close}
          className="absolute right-4 top-4 text-2xl text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Acceder
        </h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          Inicia sesión para gestionar tus NFCs y tus reseñas.
        </p>

        <button
          type="button"
          onClick={handleGoogleEmployeeLogin}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)] disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center font-bold text-[#4285f4]">G</span>
          {googleLoading ? "Conectando con Google…" : "Entrar con Google como empleado"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <span className="h-px flex-1 bg-[var(--border)]" />
          Acceso de propietario
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl border border-[var(--input)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full rounded-xl border border-[var(--input)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          />
          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
