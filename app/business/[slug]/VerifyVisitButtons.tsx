"use client";

import { useState } from "react";

export function VerifyVisitButtons({ businessId }: { businessId: string }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function verifyLocation() {
    if (!navigator.geolocation) {
      setMessage("Geolocalización no disponible");
      return;
    }
    setLoadingLocation(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch(`/api/businesses/${businessId}/visits/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        });
        const data = await res.json();
        setMessage(res.ok ? data.message : data.error);
        setLoadingLocation(false);
      },
      () => {
        setMessage("No se pudo obtener la ubicación");
        setLoadingLocation(false);
      }
    );
  }

  async function verifyQr(e: React.FormEvent) {
    e.preventDefault();
    setLoadingQr(true);
    setMessage(null);

    const res = await fetch(`/api/businesses/${businessId}/visits/qr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: qrToken }),
    });
    const data = await res.json();
    setMessage(res.ok ? data.message : data.error);
    setLoadingQr(false);
    if (res.ok) setQrToken("");
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-2 font-semibold text-[var(--foreground)]">Verificar visita</h3>
      <p className="mb-3 text-sm text-[var(--muted-foreground)]">
        Verifica tu visita para que tu próxima reseña tenga más peso.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={verifyLocation}
          disabled={loadingLocation}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {loadingLocation ? "Verificando..." : "Verificar con ubicación"}
        </button>
        <form onSubmit={verifyQr} className="flex flex-1 gap-2">
          <input
            type="text"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Código QR"
            className="flex-1 rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
          />
          <button
            type="submit"
            disabled={loadingQr || !qrToken}
            className="rounded-lg border border-[var(--input)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50"
          >
            {loadingQr ? "..." : "Validar QR"}
          </button>
        </form>
      </div>
      {message && <p className="mt-2 text-sm text-[var(--primary)]">{message}</p>}
    </div>
  );
}
