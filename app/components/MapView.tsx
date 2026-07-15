"use client";

import { useEffect, useRef, useState } from "react";

interface MapViewProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  city?: string | null;
}

export function MapView({ latitude, longitude, address, city }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  useEffect(() => {
    if (latitude && longitude) {
      setCoords({ lat: latitude, lng: longitude });
      return;
    }

    const query = [address, city].filter(Boolean).join(", ");
    if (!query) return;

    let cancelled = false;
    fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const result = data.results?.[0];
        if (result?.lat && result?.lon) {
          setCoords({ lat: Number(result.lat), lng: Number(result.lon) });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, address, city]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current || !isMounted) return;

      const lat = coords?.lat ?? -2.1894;
      const lng = coords?.lng ?? -79.8891;

      const map = L.map(mapRef.current).setView([lat, lng], coords ? 15 : 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const pinIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="var(--primary)" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
        className: "custom-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      if (coords) {
        L.marker([coords.lat, coords.lng], { icon: pinIcon })
          .addTo(map)
          .bindPopup(address || city || "Ubicación")
          .openPopup();
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords, address, city]);

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="z-0 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)]"
        style={{ height: "300px" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          Cargando mapa…
        </div>
      )}
    </div>
  );
}
