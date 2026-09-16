"use client";

import { useState } from "react";

export function ReviewForm({
  onCreated,
  businessId,
}: {
  onCreated: () => void;
  businessId?: string;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        rating,
        businessId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTitle("");
      setContent("");
      setRating(5);
      setTimeout(() => {
        setSuccess(false);
        onCreated();
      }, 1500);
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear la reseña");
    }
  }

  if (success) {
    return (
      <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--accent)] p-8 text-center animate-scale-in">
        <span className="mb-2 animate-pulse-success text-4xl">✓</span>
        <p className="text-base font-bold text-[var(--accent-foreground)]">
          ¡Reseña publicada!
        </p>
        <p className="mt-1 text-sm text-[var(--accent-foreground)] opacity-80">
          +50 puntos por compartir tu experiencia
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div>
        <h2 className="text-base font-bold text-[var(--foreground)]">
          Comparte tu experiencia
        </h2>
        <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
          Tu reseña ayuda a otros usuarios a descubrir buenos lugares.
        </p>
      </div>

      {/* Star rating selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
          Tu valoración
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl transition-transform hover:scale-110"
            >
              <span className={star <= (hoverRating || rating) ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}>
                {star <= (hoverRating || rating) ? "★" : "☆"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resumen en pocas palabras"
          className="w-full rounded-xl border border-[var(--input)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
          Tu experiencia
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Cuéntanos qué te pareció..."
          className="w-full rounded-xl border border-[var(--input)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
