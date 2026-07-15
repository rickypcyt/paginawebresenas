import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { OfferCard } from "@/app/components/OfferCard";
import { EmptyState } from "@/app/components/EmptyState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ofertas disponibles — Descubre Local",
  description:
    "Aprovecha ofertas exclusivas en negocios verificados. Descuentos, promociones y beneficios para usuarios de la comunidad.",
  alternates: {
    canonical: "/ofertas",
  },
};

export default async function OfertasPage() {
  const offers = await prisma.offer.findMany({
    where: {
      OR: [{ endDate: { gte: new Date() } }, { endDate: null }],
    },
    include: { business: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          Ofertas disponibles
        </h1>
        <p className="text-[var(--muted-foreground)]">
          {offers.length} oferta{offers.length === 1 ? "" : "s"} activa{offers.length === 1 ? "" : "s"} en negocios verificados
        </p>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon="🎁"
          title="No hay ofertas activas"
          description="Cuando los negocios publiquen ofertas, aparecerán aquí."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
