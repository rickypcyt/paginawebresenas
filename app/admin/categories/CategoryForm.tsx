"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon, description }),
    });

    setLoading(false);

    if (res.ok) {
      setName("");
      setIcon("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear categoría");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Añadir categoría</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
        <input
          type="text"
          placeholder="Icono (emoji)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Añadir categoría"}
      </button>
    </form>
  );
}
