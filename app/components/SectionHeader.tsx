import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  actionLabel?: string;
}

export function SectionHeader({ title, href, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
          Descubre
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
      </div>
      {href && actionLabel && (
        <Link
          href={href}
          className="rounded-full bg-[var(--secondary)] px-3 py-1 text-sm font-medium text-[var(--secondary-foreground)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
