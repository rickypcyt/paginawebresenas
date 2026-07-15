import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BusinessCard } from "../components/BusinessCard";
import { FavoritesLoginPrompt } from "./FavoritesLoginPrompt";

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Favoritos</h1>
        <FavoritesLoginPrompt />
      </div>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      business: {
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const businesses = favorites.map((f) => ({
    ...f.business,
    rating: f.business.reviews.length
      ? f.business.reviews.reduce((sum, r) => sum + r.rating, 0) / f.business.reviews.length
      : 0,
    reviewCount: f.business.reviews.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Favoritos</h1>

      {businesses.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">Aún no tienes favoritos.</p>
          <Link
            href="/explore"
            className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Explorar negocios
          </Link>
        </div>
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
