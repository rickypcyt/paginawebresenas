"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export function AddEmployeeForm({ businessId }: { businessId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/businesses/${businessId}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, userEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo crear el empleado");
        return;
      }
      setName("");
      setRole("");
      setUserEmail("");
      router.refresh();
    } catch {
      setError("No se pudo crear el empleado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre *"
          required
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Cargo (opcional)"
          maxLength={80}
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
        />
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Email de cuenta (opcional)"
          autoCapitalize="none"
          autoCorrect="off"
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
        />
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        Si indicas el email de una cuenta registrada, el empleado podrá entrar y ver su ranking y comentarios.
      </p>
      {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        <UserPlus className="h-3.5 w-3.5" /> {loading ? "Creando…" : "Añadir empleado"}
      </button>
    </form>
  );
}
