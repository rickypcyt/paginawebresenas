import prisma from "@/lib/prisma";
import { OfferCard } from "@/app/components/OfferCard";
import { SectionHeader } from "@/app/components/SectionHeader";
import { EmptyState } from "@/app/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const now = new Date();
  const [featured, endingSoon, popular] = await Promise.all([
    prisma.offer.findMany({
      where: { featured: true, OR: [{ endDate: { gte: now } }, { endDate: null }] },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { business: { select: { name: true, slug: true } } },
    }),
    prisma.offer.findMany({
      where: { endDate: { gte: now, lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) } },
      orderBy: { endDate: "asc" },
      take: 4,
      include: { business: { select: { name: true, slug: true } } },
    }),
    prisma.offer.findMany({
      where: { OR: [{ endDate: { gte: now } }, { endDate: null }] },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { business: { select: { name: true, slug: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Ofertas</h1>

      {featured.length > 0 && (
        <section className="mb-10">
          <SectionHeader title="Destacadas" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {endingSoon.length > 0 && (
        <section className="mb-10">
          <SectionHeader title="Finalizan hoy" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {endingSoon.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section className="mb-10">
          <SectionHeader title="Más populares" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && endingSoon.length === 0 && popular.length === 0 && (
        <EmptyState
          icon="🎁"
          title="No hay ofertas activas"
          description="Cuando los negocios publiquen promociones, aparecerán aquí para que las aproveches."
          actionLabel="Explorar negocios"
          actionHref="/explore"
        />
      )}
    </div>
  );
}
