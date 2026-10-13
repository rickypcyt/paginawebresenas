import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";
import { getAdminData } from "@/lib/toque-data";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");
  if (!isAdmin(session.user.role)) redirect("/dashboard");

  const data = await getAdminData();

  return <AdminPanel initialData={data} />;
}
