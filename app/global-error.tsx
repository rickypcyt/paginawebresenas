"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
        <h1 className="text-2xl font-semibold">Algo salió mal</h1>
        {error.digest && (
          <p className="mt-2 font-mono text-sm text-[var(--muted-foreground)]">
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-[var(--primary)] px-6 py-2 text-sm font-medium text-[var(--primary-foreground)]"
        >
          Intentar de nuevo
        </button>
      </body>
    </html>
  );
}
