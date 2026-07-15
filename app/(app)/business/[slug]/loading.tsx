export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-64 w-full animate-pulse rounded-3xl bg-[var(--muted)]" />
      <div className="mb-8 flex items-center gap-4">
        <div className="h-20 w-20 animate-pulse rounded-2xl bg-[var(--muted)]" />
        <div className="space-y-2">
          <div className="h-7 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-4 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
      </div>
      <div className="mb-8 h-10 w-full animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-[var(--muted)]"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--muted)]" />
      </div>
    </div>
  );
}
