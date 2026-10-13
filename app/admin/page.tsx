import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");
  if (!isAdmin(session.user.role)) redirect("/dashboard");

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/toque/admin`, {
    credentials: "include",
  });

  const data = res.ok ? await res.json() : null;

  return <AdminPanel initialData={data} />;
}
