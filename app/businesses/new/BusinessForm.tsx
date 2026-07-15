"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPicker } from "@/app/components/MapPicker";
import { BusinessHoursInput } from "./BusinessHoursInput";

export function BusinessForm({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        categoryId,
        newCategory,
        address,
        city,
        phone,
        website,
        hours,
        description,
        latitude,
        longitude,
      }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/business/${data.business.slug}`);
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear negocio");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Categoría</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        >
          <option value="">Selecciona categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="new">+ Añadir nueva categoría</option>
        </select>
      </div>

      {categoryId === "new" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Nueva categoría</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la categoría"
            required={categoryId === "new"}
            className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Sitio web</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Horario</label>
        <BusinessHoursInput value={hours} onChange={setHours} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-[var(--foreground)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Ubicación (haz clic en el mapa)</label>
        <MapPicker
          latitude={latitude}
          longitude={longitude}
          onSelect={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
        {latitude && longitude && (
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[var(--primary)] px-6 py-2 font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear negocio"}
      </button>
    </form>
  );
}
