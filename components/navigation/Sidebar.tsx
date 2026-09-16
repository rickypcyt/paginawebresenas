"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
}

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href !== "/dashboard" && href !== "/" && pathname.startsWith(href)) return true;
  return false;
}

export function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-64">
      <nav className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {title}
        </p>
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-[var(--primary-light)] text-[var(--primary-dark)]" : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"}`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    {item.label}
                  </span>
                  {active && (
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
