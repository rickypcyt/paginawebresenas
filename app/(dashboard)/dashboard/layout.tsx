import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { getSession } from "@/lib/session";
import { isBusiness } from "@/lib/roles";
import {
  LayoutDashboard,
  MousePointerClick,
  Users,
  Tag,
  MessageSquareText,
  SmartphoneNfc,
} from "lucide-react";

const links = [
  { href: "/dashboard/taps", label: "Toque", icon: <MousePointerClick className="h-4 w-4" /> },
  { href: "/dashboard", label: "Resumen", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/dashboard/team", label: "Personal y ranking", icon: <Users className="h-4 w-4" /> },
  { href: "/dashboard/nfc-tags", label: "Tags NFC", icon: <Tag className="h-4 w-4" /> },
  { href: "/dashboard/reviews", label: "Reseñas", icon: <MessageSquareText className="h-4 w-4" /> },
  { href: "/dashboard/simulator", label: "Simulador de tap", icon: <SmartphoneNfc className="h-4 w-4" /> },
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
      <Sidebar title="Panel del dueño" items={links} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
