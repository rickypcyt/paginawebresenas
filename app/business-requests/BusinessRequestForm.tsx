"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
}

export function BusinessRequestForm({
  categories,
  initialName = "",
}: {
  categories: CategoryOption[];
  initialName?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Guayaquil");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const categoryName = categories.find((c) => c.id === categoryId)?.name;

    const res = await fetch("/api/business-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        city,
        categoryId: categoryId || null,
        categoryName,
        description,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setName("");
      setAddress("");
      setCategoryId("");
      setDescription("");
      router.refresh();
    } else {
      alert("Error al enviar la solicitud. ¿Iniciaste sesión?");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Solicitar un negocio</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del negocio"
          required
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        >
          <option value="">Categoría (opcional)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección"
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad"
          className="rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="¿Por qué debería estar en la plataforma?"
        rows={3}
        className="mt-4 w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-xl bg-[var(--primary)] px-6 py-2 font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Solicitar negocio"}
      </button>
    </form>
  );
}
