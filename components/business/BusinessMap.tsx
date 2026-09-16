"use client";

import { useEffect, useRef, useState } from "react";

interface BusinessPin {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}

interface BusinessMapProps {
  businesses: BusinessPin[];
}

export function BusinessMap({ businesses }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current || !isMounted) return;

      const pins = businesses.filter((b) => b.latitude && b.longitude);

      const lat = pins[0]?.latitude ?? -2.1894;
      const lng = pins[0]?.longitude ?? -79.8891;

      const map = L.map(mapRef.current).setView([lat, lng], pins.length > 1 ? 13 : 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const pinIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="var(--primary)" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      pins.forEach((b) => {
        L.marker([b.latitude, b.longitude], { icon: pinIcon })
          .addTo(map)
          .bindPopup(
            `<a href="/business/${b.slug}" style="font-weight:600;color:var(--primary);text-decoration:none;">${b.name}</a>`
          );
      });

      if (pins.length > 1) {
        const bounds = L.latLngBounds(pins.map((b) => [b.latitude, b.longitude]));
        map.fitBounds(bounds, { padding: [40, 40] });
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
  }, [businesses]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        className="z-0 h-full w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)]"
        style={{ minHeight: "300px" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          Cargando mapa…
        </div>
      )}
    </div>
  );
}
