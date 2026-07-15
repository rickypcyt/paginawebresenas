import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BusinessQrDisplay } from "./BusinessQrDisplay";

interface QrPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessQrPage({ params }: QrPageProps) {
  const { slug } = await params;
  const session = await getSession();

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, name: true, ownerId: true },
  });

  if (!business) return notFound();

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      })
    : null;

  if (business.ownerId !== session?.user?.id && user?.role !== "admin") {
    redirect(`/business/${slug}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Código QR</h1>
      <p className="mb-6 text-[var(--muted-foreground)]">{business.name}</p>
      <BusinessQrDisplay businessId={business.id} />
    </div>
  );
}
