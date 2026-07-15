import prisma from "@/lib/prisma";
import { OfferCard } from "../../components/OfferCard";

export default async function AdminCampaignsPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { business: { select: { name: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Campañas</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
