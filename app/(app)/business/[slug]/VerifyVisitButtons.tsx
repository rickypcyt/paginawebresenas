"use client";

import { useState } from "react";

export function VerifyVisitButtons({ businessId }: { businessId: string }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function verifyLocation() {
    if (!navigator.geolocation) {
      setMessage("Tu navegador no soporta geolocalización");
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
        setLoadingLocation(false);
        if (res.ok) {
          setSuccess(true);
          setMessage(data.message);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          setMessage(data.error);
        }
      },
      () => {
        setMessage("No pudimos obtener tu ubicación. ¿Está activada?");
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
    setLoadingQr(false);
    if (res.ok) {
      setSuccess(true);
      setMessage(data.message);
      setQrToken("");
      setShowQr(false);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setMessage(data.error);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="mb-1 text-base font-bold text-[var(--foreground)]">
        Verifica tu visita
      </h3>
      <p className="mb-4 text-sm text-[var(--muted-foreground)]">
        Verifica que estás aquí y tu próxima reseña tendrá más peso. ⭐
      </p>

      {/* Acción principal */}
      <button
        onClick={verifyLocation}
        disabled={loadingLocation}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)] disabled:opacity-50"
      >
        <span className="text-lg">📍</span>
        {loadingLocation ? "Verificando ubicación..." : "Verificar con mi ubicación"}
      </button>

      {/* Acción secundaria */}
      {!showQr ? (
        <button
          onClick={() => setShowQr(true)}
          className="mt-2 w-full text-center text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-dark)]"
        >
          ¿Tienes un código QR? →
        </button>
      ) : (
        <form onSubmit={verifyQr} className="mt-3 flex gap-2">
          <input
            type="text"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Pega el código QR"
            className="flex-1 rounded-xl border border-[var(--input)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            autoFocus
          />
          <button
            type="submit"
            disabled={loadingQr || !qrToken}
            className="rounded-xl border border-[var(--input)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
          >
            {loadingQr ? "..." : "Validar"}
          </button>
        </form>
      )}

      {/* Feedback */}
      {message && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
            success
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          }`}
        >
          {success && <span className="animate-pulse-success text-lg">✓</span>}
          {message}
        </div>
      )}
    </div>
  );
}
