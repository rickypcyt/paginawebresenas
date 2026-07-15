"use client";

import { useState } from "react";

export function ReviewForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        rating: Number(rating),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setContent("");
      setRating("5");
      onCreated();
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear la reseña");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded bg-gray-800 p-4">
      <h2 className="text-xl font-semibold">Nueva reseña</h2>
      <div>
        <label className="block text-sm text-gray-300">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded bg-gray-700 px-3 py-2 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Contenido</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded bg-gray-700 px-3 py-2 text-white"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Puntuación (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full rounded bg-gray-700 px-3 py-2 text-white"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear reseña"}
      </button>
    </form>
  );
}
