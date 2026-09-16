import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { getSession } from "@/lib/session";
import { isBusiness } from "@/lib/roles";

const links = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/dashboard/business", label: "Mi negocio", icon: "🏪" },
  { href: "/dashboard/reviews", label: "Reseñas", icon: "💬" },
  { href: "/dashboard/stats", label: "Rendimiento NFC", icon: "📊" },
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
      <Sidebar title="Tu panel" items={links} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
