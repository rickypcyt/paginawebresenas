import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { OfferCard } from "../../components/OfferCard";

export default async function ProfileOffersPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/explore");

  const redemptions = await prisma.offerRedemption.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      offer: {
        include: { business: { select: { name: true, slug: true } } },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Mis ofertas</h1>
      {redemptions.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no has reclamado ofertas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {redemptions.map((r) => (
            <OfferCard key={r.id} offer={r.offer} />
          ))}
        </div>
      )}
    </div>
  );
}
