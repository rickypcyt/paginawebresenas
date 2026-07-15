import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}

export function SectionHeader({ title, subtitle, href, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        )}
      </div>
      {href && actionLabel && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-dark)]"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
