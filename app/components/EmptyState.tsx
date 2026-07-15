import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] px-6 py-12 text-center">
      <span className="mb-3 text-4xl">{icon}</span>
      <h3 className="mb-1 text-base font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
