import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { BusinessCard } from "@/app/components/BusinessCard";
import { EmptyState } from "@/app/components/EmptyState";

export const revalidate = 3600;

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

function slugToCity(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cityName = slugToCity(slug);

  const count = await prisma.business.count({
    where: {
      city: { equals: cityName, mode: "insensitive" },
      status: { in: ["community", "verified", "premium"] },
    },
  });

  if (count === 0) return { title: "Ciudad no encontrada" };

  const title = `Negocios en ${cityName} — Reseñas y ofertas verificadas`;
  const description = `Descubre los mejores negocios en ${cityName}: cafeterías, restaurantes, gimnasios y más. Reseñas verificadas, ofertas y horarios.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/ciudad/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export const dynamicParams = true;

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const cityName = slugToCity(slug);

  const [businesses, categories] = await Promise.all([
    prisma.business.findMany({
      where: {
        city: { equals: cityName, mode: "insensitive" },
        status: { in: ["community", "verified", "premium"] },
      },
      include: {
        category: true,
        reviews: { select: { rating: true } },
        offers: {
          where: { OR: [{ endDate: { gte: new Date() } }, { endDate: null }] },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: {
        businesses: {
          some: {
            city: { equals: cityName, mode: "insensitive" },
            status: { in: ["community", "verified", "premium"] },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (businesses.length === 0) return notFound();

  const businessesWithStats = businesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));

  const businessesWithOffers = businessesWithStats.filter((b) => b.offers.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-6 py-10 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)] md:text-4xl">
          Negocios en {cityName}
        </h1>
        <p className="text-[var(--muted-foreground)]">
          {businesses.length} negocio{businesses.length === 1 ? "" : "s"} verificado{businesses.length === 1 ? "" : "s"} · {businessesWithOffers.length} con ofertas activas
        </p>
      </div>

      {/* Categorías disponibles en esta ciudad */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {cat.icon || "🏷️"} {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Ofertas en esta ciudad */}
      {businessesWithOffers.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
            🎁 Con ofertas disponibles
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {businessesWithOffers.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* Todos los negocios */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Todos los negocios en {cityName}
        </h2>
        {businessesWithStats.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No hay negocios en esta ciudad aún"
            description="¿Conoces un negocio que debería estar aquí? Regístralo para que aparezca."
            actionLabel="Registrar negocio"
            actionHref="/business-requests"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {businessesWithStats.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
