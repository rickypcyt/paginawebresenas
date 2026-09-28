import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/businesses", label: "Negocios" },
  { href: "/admin/requests", label: "Solicitudes" },
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
      <Sidebar title="Admin" items={links} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
