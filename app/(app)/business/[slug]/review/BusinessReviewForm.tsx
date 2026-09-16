"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StarRating } from "@/app/components/StarRating";

interface ReviewFormProps {
  business: {
    id: string;
    name: string;
    slug: string;
    address?: string | null;
    city?: string | null;
  };
}

export function ReviewForm({ business }: ReviewFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  const reviewText = `⭐`.repeat(rating) + "\n" + (title ? `${title}\n` : "") + content + `\n— en ${business.name}${business.address ? `, ${business.address}` : ""}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name} ${business.city || ""} ${business.address || ""}`.trim()
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, rating, businessId: business.id }),
    });

    setLoading(false);

    if (res.ok) {
      setPublished(true);
    } else {
      alert("Error al publicar la reseña");
    }
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("No se pudo copiar el texto");
    }
  }

  if (published) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <p className="mb-2 text-4xl">🎉</p>
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
          Tu reseña se publicó
        </h2>
        <div className="mb-6 flex justify-center">
          <StarRating rating={rating} />
        </div>

        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          ¿Quieres compartirla en Google Maps?
        </p>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            Abrir Google Maps
          </a>
          <button
            onClick={copyReview}
            className="rounded-xl border border-[var(--input)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            {copied ? "Copiado ✅" : "Copiar reseña"}
          </button>
        </div>

        <Link
          href={`/business/${business.slug}`}
          className="inline-block text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Volver al negocio
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Excelente atención"
          className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Puntuación</label>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl ${n <= rating ? "text-yellow-500" : "text-gray-300"}`}
              aria-label={`${n} estrellas`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Reseña</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="Cuenta tu experiencia..."
          className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="rounded-xl bg-[var(--primary)] px-6 py-2 font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar reseña"}
      </button>
    </form>
  );
}
