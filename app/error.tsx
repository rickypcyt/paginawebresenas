"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">
        Algo salió mal
      </h1>
      {error.digest && (
        <p className="mb-6 font-mono text-sm text-[var(--muted-foreground)]">
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
