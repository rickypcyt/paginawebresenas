import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/businesses", label: "Negocios" },
  { href: "/admin/reviews", label: "Reseñas" },
  { href: "/admin/campaigns", label: "Campañas" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/reports", label: "Reportes" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user || !isAdmin(session.user.role)) {
    redirect("/profile");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-64">
        <nav className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Admin
          </p>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
