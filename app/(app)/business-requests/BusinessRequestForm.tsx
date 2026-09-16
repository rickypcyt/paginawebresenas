"use client";

import { useState } from "react";

interface CategoryOption {
  id: string;
  name: string;
}

export function BusinessRequestForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Guayaquil");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const categoryName = categories.find((c) => c.id === categoryId)?.name;

    try {
      const res = await fetch("/api/contact-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          phone,
          category: categoryName,
          city,
          address,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar");
      }

      setSent(true);
      setBusinessName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("Guayaquil");
      setCategoryId("");
      setMessage("");
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
          ¡Mensaje enviado!
        </h2>
        <p className="text-[var(--muted-foreground)]">
          Gracias por contactarnos. Te responderemos lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nombre del negocio"
          required
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
        <input
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Nombre del contacto"
          required
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email de contacto"
          required
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono"
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
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
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad"
          className="rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
        />
      </div>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Dirección del negocio"
        className="mb-4 w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="¿En qué podemos ayudarte? Cuéntanos un poco más sobre tu negocio."
        rows={4}
        className="mb-6 w-full rounded-xl border border-[var(--input)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
      />

      {error && <p className="mb-4 text-sm text-[var(--destructive)]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50 md:w-auto"
      >
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
