import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { SearchBar } from "./components/SearchBar";
import { SectionHeader } from "./components/SectionHeader";
import { BusinessCard } from "./components/BusinessCard";
import { CategoryCard } from "./components/CategoryCard";
import { OfferCard } from "./components/OfferCard";
import { ReviewCard } from "./components/ReviewCard";
import { AuthButton } from "./components/AuthButton";

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
    rating:
      b.reviews.length > 0
        ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
        : 0,
    reviewCount: b.reviews.length,
  }));
}

export default async function HomePage() {
  const session = await getSession();
  const userName = session?.user?.name;

  const [categories, featuredBusinesses, newBusinesses, offers, recentReviews] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" }, take: 6 }),
      prisma.business.findMany({
        where: { featured: true, status: { in: ["community", "verified", "premium"] } },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { category: true, reviews: { select: { rating: true } } },
      }),
      prisma.business.findMany({
        where: { status: { in: ["community", "verified", "premium"] } },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { category: true, reviews: { select: { rating: true } } },
      }),
      prisma.offer.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { business: { select: { name: true, slug: true } } },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          user: { select: { name: true, image: true } },
          business: { select: { name: true } },
        },
      }),
    ]);

  const topRated = computeBusinessStats(
    await prisma.business.findMany({
      where: { status: { in: ["community", "verified", "premium"] } },
      take: 20,
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: "desc" },
    })
  )
    .filter((b) => b.reviewCount > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const featured = computeBusinessStats(featuredBusinesses);
  const newest = computeBusinessStats(newBusinesses);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-6 py-14 text-center shadow-[var(--shadow)] md:py-20">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-6xl">
            {userName ? `¿Qué puedes hacer hoy, ${userName}?` : "Descubre lo mejor cerca de ti"}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-[var(--muted-foreground)]">
            Negocios verificados, reseñas reales y ofertas en tu ciudad.
          </p>
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-2 shadow-[var(--shadow-lg)]">
            <SearchBar />
          </div>
          {!session && (
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <AuthButton />
              <Link
                href="/explore"
                className="rounded-xl border border-[var(--primary)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
              >
                Explorar sin cuenta
              </Link>
            </div>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Categorías" href="/categories" actionLabel="Ver todas" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Negocios destacados" href="/explore" actionLabel="Ver más" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Ofertas cerca de ti" href="/offers" actionLabel="Ver todas" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {newest.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Nuevos negocios" href="/explore" actionLabel="Ver más" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {recentReviews.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Reseñas recientes" href="/explore" actionLabel="Ver más" />
          <div className="grid gap-4 md:grid-cols-2">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {topRated.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Negocios mejor valorados" href="/explore" actionLabel="Ver más" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
