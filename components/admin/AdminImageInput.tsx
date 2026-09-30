"use client";

import { useRef, useState } from "react";

export function AdminImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    setUploading(false);
    if (res.ok) {
      const json = await res.json();
      onChange(json.url);
    } else {
      const json = await res.json().catch(() => null);
      setError(json?.error ?? "Error al subir la imagen");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img
          src={value}
          alt="Logo"
          className="h-14 w-14 shrink-0 rounded-xl border border-[var(--border)] object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--input)] text-xl text-[var(--muted-foreground)]">
          🏪
        </div>
      )}
      <div className="min-w-0">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
          className="block w-full text-xs text-[var(--muted-foreground)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--primary-light)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--primary-dark)] hover:file:bg-[var(--muted)]"
        />
        {uploading && <p className="mt-1 text-xs text-[var(--muted-foreground)]">Subiendo…</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
