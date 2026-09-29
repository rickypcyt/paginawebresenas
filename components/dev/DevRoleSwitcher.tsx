"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { id: "user", label: "Cliente" },
  { id: "employee", label: "Empleado" },
  { id: "business", label: "Jefe" },
  { id: "admin", label: "Admin" },
] as const;

const REDIRECTS: Record<string, string> = {
  user: "/dashboard",
  employee: "/dashboard",
  business: "/dashboard",
  admin: "/dashboard",
};

export function DevRoleSwitcher({ currentRole }: { currentRole?: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setRole(role: string) {
    setLoading(role);
    setError(null);
    try {
      const response = await fetch("/api/dev/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo cambiar el rol");
        return;
      }
      router.refresh();
      const target = REDIRECTS[role];
      if (target) router.push(target);
    } catch {
      setError("No se pudo cambiar el rol");
    } finally {
      setLoading(null);
    }
  }

  async function seedDemo() {
    setLoading("seed");
    setError(null);
    try {
      const response = await fetch("/api/dev/seed", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudieron crear los datos demo");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudieron crear los datos demo");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mb-8 rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-5">
      <p className="mb-1 text-sm font-semibold text-amber-800">Vista previa de roles (solo desarrollo)</p>
      <p className="mb-3 text-xs text-amber-700">Cambia tu cuenta de rol para ver la app como la vería cada tipo de usuario. Los datos de demo se crean solos si faltan.</p>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setRole(role.id)}
            disabled={loading !== null}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
              currentRole === role.id
                ? "bg-amber-600 text-white"
                : "border border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
            }`}
          >
            {loading === role.id ? "Cambiando…" : role.label}
          </button>
        ))}
        <button
          type="button"
          onClick={seedDemo}
          disabled={loading !== null}
          className="rounded-lg border border-dashed border-amber-400 bg-white px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
        >
          {loading === "seed" ? "Sembrando…" : "Datos demo"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
