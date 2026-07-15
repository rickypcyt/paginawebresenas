import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { OfferCard } from "@/app/components/OfferCard";

export default async function DashboardCampaignsPage() {
  const session = await getSession();
  const businessIds = (
    await prisma.business.findMany({
      where: { ownerId: session?.user?.id },
      select: { id: true },
    })
  ).map((b) => b.id);

  const offers = await prisma.offer.findMany({
    where: { businessId: { in: businessIds } },
    orderBy: { createdAt: "desc" },
    include: { business: { select: { name: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Campañas</h1>
      {offers.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no has creado campañas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
