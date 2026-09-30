"use client";

import { useEffect, useState } from "react";
import { useAuthModal } from "./AuthModalProvider";
import { signIn, signUp, updateUser } from "@/lib/auth-client";

type BusinessOption = { id: string; name: string; slug: string; city: string | null };

export function LoginModal() {
  const { isOpen, redirectTo, close } = useAuthModal();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"credentials" | "onboarding">("credentials");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/businesses")
      .then((r) => (r.ok ? r.json() : { businesses: [] }))
      .then((d) => setBusinesses(d.businesses ?? []))
      .catch(() => setBusinesses([]));
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signIn.social({ provider: "google", callbackURL: "/auth/redirect" });
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
      const result =
        mode === "signup"
          ? await signUp.email({ name: name.trim() || email.split("@")[0], email, password })
          : await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message || "Error al iniciar sesión");
        return;
      }

      if (mode === "signup") {
        setStep("onboarding");
        setLoading(false);
        return;
      }

      const selected = businesses.find((b) => b.id === businessId);
      if (selected) {
        // Solicitud de empleado al negocio elegido (pendiente de aprobación del admin)
        await fetch("/api/employee-join-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: selected.id }),
        }).catch(() => {});
        window.location.assign("/employee/join");
      } else {
        window.location.assign(redirectTo || "/dashboard");
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  async function handleOnboarding(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const trimmed = name.trim();
      if (trimmed) await updateUser({ name: trimmed }).catch(() => {});

      const selected = businesses.find((b) => b.id === businessId);
      if (selected) {
        await fetch("/api/employee-join-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: selected.id }),
        }).catch(() => {});
        window.location.assign("/employee/join");
      } else {
        window.location.assign(redirectTo || "/dashboard");
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.");
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
          {step === "onboarding" ? "Completa tu perfil" : "Acceder"}
        </h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          {step === "onboarding"
            ? "Confirma tu nombre y elige el negocio donde trabajas."
            : "Inicia sesión para gestionar tus NFCs y tus reseñas."}
        </p>

        {step === "credentials" && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)] disabled:opacity-50"
            >
              <span className="flex h-5 w-5 items-center justify-center font-bold text-[#4285f4]">G</span>
              {googleLoading ? "Conectando con Google…" : "Continuar con Google"}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="h-px flex-1 bg-[var(--border)]" />
              Con correo y contraseña
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-full bg-[var(--secondary)] p-1 text-sm font-medium">
              {(
                [
                  { id: "signin", label: "Iniciar sesión" },
                  { id: "signup", label: "Crear cuenta" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    setError(null);
                  }}
                  className={`rounded-full py-2 transition ${
                    mode === m.id
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  className="w-full rounded-xl border border-[var(--input)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              )}
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
              {mode === "signin" && (
                <select
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                >
                  <option value="">Sin negocio (solo mi cuenta)</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                      {b.city ? ` · ${b.city}` : ""}
                    </option>
                  ))}
                </select>
              )}
              {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Cargando..." : mode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </form>
          </>
        )}

        {step === "onboarding" && (
          <form onSubmit={handleOnboarding} className="space-y-3">
            <div>
              <label htmlFor="ob-name" className="mb-1.5 block text-xs font-medium text-[var(--foreground)]">
                Tu nombre
              </label>
              <input
                id="ob-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                required
                className="w-full rounded-xl border border-[var(--input)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
              />
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                Así aparecerás para el negocio y los clientes. Puedes corregirlo.
              </p>
            </div>
            <div>
              <label htmlFor="ob-business" className="mb-1.5 block text-xs font-medium text-[var(--foreground)]">
                Negocio donde trabajas
              </label>
              <select
                id="ob-business"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
              >
                <option value="">Sin negocio (solo mi cuenta)</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.city ? ` · ${b.city}` : ""}
                  </option>
                ))}
              </select>
            </div>
            {businessId && (
              <p className="text-xs text-[var(--muted-foreground)]">
                Enviaremos tu solicitud al negocio. Un administrador la aprueba desde el panel.
              </p>
            )}
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Enviando..." : businessId ? "Enviar solicitud" : "Continuar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
