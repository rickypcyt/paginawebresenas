import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/navigation/Navbar";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-20 md:pb-8">{children}</main>
    </>
  );
}
