import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { BusinessCard } from "@/app/components/BusinessCard";
import { EmptyState } from "@/app/components/EmptyState";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) return { title: "Categoría no encontrada" };

  const title = `${category.name} — Reseñas y ofertas verificadas`;
  const description =
    category.description ||
    `Descubre los mejores ${category.name.toLowerCase()} verificados. Reseñas reales, ofertas, horarios y ubicación.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categoria/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export const dynamicParams = true;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) return notFound();

  const businesses = await prisma.business.findMany({
    where: {
      categoryId: category.id,
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
  });

  const businessesWithStats = businesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));

  const cities = Array.from(
    new Set(
      businesses
        .map((b) => b.city)
        .filter((c): c is string => Boolean(c))
    )
  ).sort();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-6 py-10 text-center">
        <span className="mb-2 block text-4xl">{category.icon || "🏷️"}</span>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)] md:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mx-auto max-w-xl text-[var(--muted-foreground)]">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {businesses.length} negocio{businesses.length === 1 ? "" : "s"} en esta categoría
        </p>
      </div>

      {/* Ciudades con negocios en esta categoría */}
      {cities.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Filtrar por ciudad
          </h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/ciudad/${city.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                📍 {city}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Negocios */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          {businessesWithStats.length > 0
            ? `Los mejores ${category.name.toLowerCase()}`
            : "Sin negocios aún"}
        </h2>
        {businessesWithStats.length === 0 ? (
          <EmptyState
            icon="🏪"
            title={`No hay ${category.name.toLowerCase()} registrados aún`}
            description="¿Conoces un negocio de esta categoría? Anímale a registrarse."
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
