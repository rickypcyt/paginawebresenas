import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { BusinessCard } from "../../components/BusinessCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      businesses: {
        where: { status: { in: ["community", "verified", "premium"] } },
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) return notFound();

  const businesses = computeStats(category.businesses).sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{category.icon || "🏷️"}</span>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{category.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {businesses.length} negocios
          </p>
        </div>
      </div>

      {businesses.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">
          Aún no hay negocios verificados en esta categoría.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
