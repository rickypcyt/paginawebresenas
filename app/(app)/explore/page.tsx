import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { SearchBar } from "@/app/components/SearchBar";
import { BusinessCard } from "@/app/components/BusinessCard";
import { FilterSelect } from "@/app/components/FilterSelect";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Explorar Negocios - Reseñas y Ofertas Locales",
  description: "Descubre negocios verificados, lee reseñas reales y aprovecha ofertas cerca de ti.",
};

interface ExplorePageProps {
  searchParams: Promise<{ q?: string; category?: string; city?: string; minRating?: string; offers?: string }>;
}

type WithReviews = { reviews: { rating: number }[] };

type BusinessWithStats<T extends WithReviews> = T & {
  rating: number;
  reviewCount: number;
};

function computeStats<T extends WithReviews>(
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

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";
  const categorySlug = params.category;
  const city = params.city;
  const minRating = Number(params.minRating) || 0;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const selectedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const businesses = await prisma.business.findMany({
    where: {
      status: { in: ["community", "verified", "premium"] },
      ...(selectedCategory && { categoryId: selectedCategory.id }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      reviews: { select: { rating: true } },
      offers: { select: { id: true } },
    },
  });

  const withStats = computeStats(businesses)
    .filter((b) => b.rating >= minRating)
    .filter((b) => (params.offers === "true" ? b.offers.length > 0 : true));

  const cities = Array.from(
    new Set(
      businesses
        .map((b) => b.city)
        .filter((c): c is string => typeof c === "string" && c.length > 0)
    )
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Explorar</h1>

      <div className="mb-6">
        <SearchBar initialQuery={query} />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          href="/explore"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !categorySlug ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/explore?category=${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              categorySlug === cat.slug
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-4">
        <FilterSelect param="city" label="Ciudad">
          <option value="">Todas</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect param="minRating" defaultValue="0" label="Valoración mínima">
          <option value="0">Cualquiera</option>
          <option value="4">4+ estrellas</option>
          <option value="3">3+ estrellas</option>
          <option value="2">2+ estrellas</option>
        </FilterSelect>

        <div className="flex items-end md:col-span-2">
          <Link
            href={params.offers === "true" ? "/explore" : "/explore?offers=true"}
            className={`w-full rounded-lg px-4 py-2 text-center text-sm font-medium ${
              params.offers === "true"
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] bg-white text-[var(--foreground)]"
            }`}
          >
            🎁 {params.offers === "true" ? "Ver todos" : "Con ofertas"}
          </Link>
        </div>
      </div>

      <div className="mb-4 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6 text-center lg:col-span-1">
          <p className="text-sm text-[var(--muted-foreground)]">Mapa</p>
          <p className="mt-2 text-3xl">🗺️</p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Disponible próximamente
          </p>
        </div>

        <div className="lg:col-span-2">
          {withStats.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
              <p className="text-[var(--muted-foreground)]">
                No encontramos negocios con esos filtros.
              </p>
              <Link
                href="/explore"
                className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Limpiar filtros
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {withStats.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
