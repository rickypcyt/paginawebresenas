import Link from "next/link";

interface SidebarItem {
  href: string;
  label: string;
  icon?: string;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
}

export function Sidebar({ title, items }: SidebarProps) {
  return (
    <aside className="w-full shrink-0 md:w-64">
      <nav className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]${item.icon ? " flex items-center gap-2.5" : ""}`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
