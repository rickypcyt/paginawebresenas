import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BusinessForm } from "./BusinessForm";

export default async function NewBusinessPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/explore");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Registrar negocio</h1>
      <BusinessForm categories={categories} />
    </div>
  );
}
