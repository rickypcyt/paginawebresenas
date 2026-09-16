"use client";

import { useEffect, useRef, useState } from "react";

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onSelect: (lat: number, lng: number) => void;
}

export function MapPicker({ latitude, longitude, onSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current || !isMounted) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current).setView(
          [latitude || 40.4168, longitude || -3.7038],
          13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          onSelect(lat, lng);

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
          }
        });

        mapInstanceRef.current = map;
      }

      if (latitude && longitude) {
        mapInstanceRef.current.setView([latitude, longitude], 13);
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.marker([latitude, longitude]).addTo(
            mapInstanceRef.current
          );
        }
      }

      setIsLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, onSelect]);

  return (
    <div>
      <div
        ref={mapRef}
        className="rounded border border-gray-600"
        style={{ height: "300px", width: "100%" }}
      />
      {!isLoaded && (
        <p className="mt-2 text-sm text-gray-400">Cargando mapa...</p>
      )}
    </div>
  );
}
