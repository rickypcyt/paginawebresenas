import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isBusiness } from "@/lib/roles";

const links = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/dashboard/business", label: "Mi negocio", icon: "🏪" },
  { href: "/dashboard/reviews", label: "Reseñas", icon: "💬" },
  { href: "/dashboard/campaigns", label: "Ofertas", icon: "🎁" },
  { href: "/dashboard/stats", label: "Estadísticas", icon: "📊" },
  { href: "/dashboard/customers", label: "Clientes", icon: "👥" },
  { href: "/dashboard/settings", label: "Configuración", icon: "⚙️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user || !isBusiness(session.user.role)) {
    redirect("/profile");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-64">
        <nav className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Tu panel
          </p>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                >
                  <span>{link.icon}</span>
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
