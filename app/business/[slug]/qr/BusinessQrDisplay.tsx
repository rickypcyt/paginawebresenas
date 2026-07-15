"use client";

import { useEffect, useState } from "react";

export function BusinessQrDisplay({ businessId }: { businessId: string }) {
  const [data, setData] = useState<{ daily: string; dynamic: string; expiresIn: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchQr() {
    try {
      const res = await fetch(`/api/businesses/${businessId}/qr`);
      if (!res.ok) throw new Error("No autorizado");
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError("No se pudo cargar el código QR");
    }
  }

  useEffect(() => {
    fetchQr();
    const interval = setInterval(fetchQr, 30000);
    return () => clearInterval(interval);
  }, [businessId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Cargando código...</p>;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const dailyUrl = `${origin}/visit/${businessId}?token=${data.daily}&mode=day`;
  const dynamicUrl = `${origin}/visit/${businessId}?token=${data.dynamic}&mode=30s`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">QR diario</h2>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dailyUrl)}`}
          alt="QR diario"
          className="mx-auto mb-3 rounded-xl border border-[var(--border)]"
        />
        <p className="text-sm text-[var(--muted-foreground)]">Cambia cada medianoche</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">QR dinámico</h2>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dynamicUrl)}`}
          alt="QR dinámico"
          className="mx-auto mb-3 rounded-xl border border-[var(--border)]"
        />
        <p className="text-sm text-[var(--muted-foreground)]">Se actualiza cada {data.expiresIn} segundos</p>
      </div>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        El cliente escanea el QR y llega a una landing donde confirma la visita y desbloquea beneficios.
      </p>
    </div>
  );
}
