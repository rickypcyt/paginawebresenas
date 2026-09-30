import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getBusinessRatingMap } from "@/lib/ratings";
import { BusinessCard } from "@/components/business/BusinessCard";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Negocios verificados — Toque",
  description:
    "Explora todos los negocios verificados de la plataforma. Cafeterías, restaurantes, gimnasios y más con reseñas reales y ofertas.",
  alternates: {
    canonical: "/negocios",
  },
};

export default async function NegociosPage() {
  const [businesses, categories] = await Promise.all([
    prisma.business.findMany({
      where: { status: { in: ["community", "verified", "premium"] } },
      include: {
        category: true,
        offers: {
          where: { OR: [{ endDate: { gte: new Date() } }, { endDate: null }] },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const ratingMap = await getBusinessRatingMap(businesses.map((b) => b.id));

  const businessesWithStats = businesses.map((b) => ({
    ...b,
    rating: ratingMap.get(b.id)?.avg ?? 0,
    reviewCount: ratingMap.get(b.id)?.count ?? 0,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          Negocios
        </h1>
        <p className="text-[var(--muted-foreground)]">
          {businesses.length} negocio{businesses.length === 1 ? "" : "s"} verificado{businesses.length === 1 ? "" : "s"} con reseñas reales
        </p>
      </div>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
            Filtrar por categoría
          </h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Listado */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">
          Todos los negocios
        </h2>
        {businessesWithStats.length === 0 ? (
          <EmptyState
            icon="🏪"
            title="Todavía no hay negocios registrados"
            description="¿Tienes un negocio? Regístralo y empieza a recibir clientes."
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

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">
          ¿No encuentras lo que buscas?
        </p>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          Usa la búsqueda dentro de la aplicación para filtrar por ciudad, valoración y ofertas.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)]"
        >
          Abrir aplicación
        </Link>
      </div>
    </div>
  );
}
