import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";
import { Navbar } from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user || !isAdmin(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
    </>
  );
}
