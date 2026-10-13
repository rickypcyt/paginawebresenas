import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdmin, isBusiness, isEmployee } from "@/lib/roles";
import DashboardPanel from "./DashboardPanel";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const role = session.user.role;
  if (isAdmin(role)) redirect("/admin");

  let url: string;
  if (isEmployee(role)) {
    url = "/api/toque/employee";
  } else if (isBusiness(role)) {
    const { businessId } = await searchParams;
    url = businessId ? `/api/toque/owner?businessId=${businessId}` : "/api/toque/owner";
  } else {
    redirect("/businesses");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${url}`, {
    credentials: "include",
  });

  const data = res.ok ? await res.json() : null;

  return <DashboardPanel initialData={data} />;
}
