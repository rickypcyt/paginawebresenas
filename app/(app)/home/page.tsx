import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { SearchBar } from "@/app/components/SearchBar";
import { SectionHeader } from "@/app/components/SectionHeader";
import { BusinessCard } from "@/app/components/BusinessCard";
import { CategoryCard } from "@/app/components/CategoryCard";
import { OfferCard } from "@/app/components/OfferCard";
import { ReviewCard } from "@/app/components/ReviewCard";
import { EmptyState } from "@/app/components/EmptyState";

export const dynamic = "force-dynamic";

type WithReviews = { reviews: { rating: number }[] };

type BusinessWithStats<T extends WithReviews> = T & {
  rating: number;
  reviewCount: number;
};

function computeBusinessStats<T extends WithReviews>(
  businesses: T[]
): BusinessWithStats<T>[] {
  return businesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));
}

export default async function HomePage() {
  const session = await getSession();
  const userName = session?.user?.name?.split(" ")[0];

  const [categories, featuredBusinesses, activeOffers, newBusinesses, recentReviews] =
    await Promise.all([
      prisma.category.findMany({ take: 6, orderBy: { name: "asc" } }),
      prisma.business.findMany({
        where: { status: { in: ["community", "verified", "premium"] } },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { category: true, reviews: { select: { rating: true } } },
      }),
      prisma.offer.findMany({
        where: {
          OR: [{ endDate: { gte: new Date() } }, { endDate: null }],
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { business: { select: { name: true, slug: true } } },
      }),
      prisma.business.findMany({
        where: { status: { in: ["community", "verified", "premium"] } },
        take: 4,
        orderBy: { createdAt: "asc" },
        include: { category: true, reviews: { select: { rating: true } } },
      }),
      prisma.review.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          business: { select: { name: true } },
        },
      }),
    ]);

  const featured = computeBusinessStats(featuredBusinesses);
  const newest = computeBusinessStats(newBusinesses);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      {/* Hero — invita a descubrir */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-6 py-12 text-center md:py-16">
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl">
            {userName ? `¿Qué descubres hoy, ${userName}?` : "Descubre lo mejor cerca de ti"}
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base text-[var(--muted-foreground)]">
            Negocios verificados, ofertas reales y experiencias que puedes ganar.
          </p>
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-2 shadow-[var(--shadow)]">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categorías — navegación rápida */}
      {categories.length > 0 && (
        <section className="mt-10">
          <SectionHeader
            title="Explora por categoría"
            subtitle="Encuentra justo lo que buscas"
            href="/categories"
            actionLabel="Ver todas"
          />
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Ofertas */}
      <section className="mt-10">
        <SectionHeader
          title="Ofertas disponibles hoy"
          subtitle="Aprovéchalas antes de que expiren"
          href="/offers"
          actionLabel="Ver todas"
        />
        {activeOffers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🎁"
            title="No hay ofertas activas"
            description="Cuando los negocios publiquen ofertas, aparecerán aquí para que las aproveches."
            actionLabel="Explorar negocios"
            actionHref="/explore"
          />
        )}
      </section>

      {/* Negocios destacados */}
      {featured.length > 0 && (
        <section className="mt-10">
          <SectionHeader
            title="Negocios destacados"
            subtitle="Los favoritos de la comunidad"
            href="/explore"
            actionLabel="Ver más"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* Nuevos negocios */}
      {newest.length > 0 && (
        <section className="mt-10">
          <SectionHeader
            title="Recién llegados"
            subtitle="Los negocios más nuevos en la plataforma"
            href="/explore"
            actionLabel="Ver más"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* Reseñas recientes */}
      {recentReviews.length > 0 && (
        <section className="mt-10">
          <SectionHeader
            title="Lo que dice la comunidad"
            subtitle="Experiencias reales de usuarios verificados"
          />
          <div className="grid gap-3 md:grid-cols-2">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
