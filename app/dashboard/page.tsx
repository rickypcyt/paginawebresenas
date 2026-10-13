import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdmin, isBusiness, isEmployee } from "@/lib/roles";
import { getEmployeeData, getOwnerData } from "@/lib/toque-data";
import DashboardPanel from "./DashboardPanel";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const role = session.user.role;
  if (isAdmin(role)) redirect("/admin");

  let data: unknown = null;
  if (isEmployee(role)) {
    data = await getEmployeeData();
  } else if (isBusiness(role)) {
    const { businessId } = await searchParams;
    data = await getOwnerData(businessId);
  } else {
    redirect("/businesses");
  }

  return <DashboardPanel initialData={data} />;
}
