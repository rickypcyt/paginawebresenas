export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-10 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="mb-6 h-12 animate-pulse rounded-2xl bg-[var(--muted)]" />
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 animate-pulse rounded-full bg-[var(--muted)]"
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-[var(--muted)]"
          />
        ))}
      </div>
    </div>
  );
}
