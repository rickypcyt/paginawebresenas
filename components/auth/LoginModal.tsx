"use client";

import { useEffect, useState } from "react";
import { useAuthModal } from "./AuthModalProvider";
import { signIn, signUp, updateUser } from "@/lib/auth-client";

type BusinessOption = { id: string; name: string; slug: string; city: string | null };

export function LoginModal() {
  const { isOpen, redirectTo, intent, close } = useAuthModal();
  const [step, setStep] = useState<"credentials" | "onboarding">("credentials");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Destino post-login: redirectTo explícito o el ?redirect= que puso el middleware.
  function postLoginTarget() {
    if (redirectTo) return redirectTo;
    const param = new URLSearchParams(window.location.search).get("redirect");
    return param && param.startsWith("/") && !param.startsWith("//")
      ? param
      : "/auth/redirect";
  }

  useEffect(() => {
    if (step !== "onboarding") return;
    fetch("/api/businesses")
      .then((r) => (r.ok ? r.json() : { businesses: [] }))
      .then((d) => setBusinesses(d.businesses ?? []))
      .catch(() => setBusinesses([]));
  }, [step]);

  if (!isOpen) return null;

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    try {
      // En flujo de cliente (reseña) volvemos a la misma página; si no, al destino post-login
      const result = await signIn.social({
        provider: "google",
        callbackURL: intent === "customer" ? window.location.href : postLoginTarget(),
      });
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
      const signInResult = await signIn.email({ email, password });
      if (!signInResult.error) {
        window.location.assign(postLoginTarget());
        return;
      }

      // Si no existe la cuenta, la creamos con el mismo correo/contraseña
      const signUpResult = await signUp.email({
        name: name.trim() || email.split("@")[0],
        email,
        password,
      });
      if (signUpResult.error) {
        setError("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // Cliente que se registra desde una reseña → recarga y sigue escribiendo, sin onboarding
      if (intent === "customer") {
        window.location.reload();
        return;
      }

      // Cuenta nueva → paso de perfil + negocio
      if (!name.trim()) setName(email.split("@")[0]);
      setStep("onboarding");
      setLoading(false);
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
        return;
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
            : "Entra con Google o con tu correo. Si no tienes cuenta, la creamos al instante."}
        </p>

        {step === "credentials" && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)] disabled:opacity-50"
            >
              {/* SVG oficial de la "G" de Google, inline para evitar requests */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              {googleLoading ? "Conectando con Google…" : "Continuar con Google"}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="h-px flex-1 bg-[var(--border)]" />
              Con correo y contraseña
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
                {loading ? "Cargando..." : "Continuar"}
              </button>
              <p className="text-center text-xs text-[var(--muted-foreground)]">
                Si el correo no tiene cuenta, te creamos una automáticamente.
              </p>
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
