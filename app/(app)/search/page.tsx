import Link from "next/link";
import prisma from "@/lib/prisma";
import { SearchBar } from "@/app/components/SearchBar";
import { BusinessCard } from "@/app/components/BusinessCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";

  const businesses = query
    ? await prisma.business.findMany({
        where: {
          status: { in: ["community", "verified", "premium"] },
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
        take: 20,
      })
    : [];

  const results = businesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)]">Resultados de búsqueda</h1>
      <div className="mb-6 max-w-2xl">
        <SearchBar initialQuery={query} />
      </div>

      {query && (
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          {results.length} resultado{results.length === 1 ? "" : "s"} para "{params.q}"
        </p>
      )}

      {results.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">
            {query
              ? "No encontramos negocios para tu búsqueda."
              : "Escribe algo para empezar a buscar."}
          </p>
          {query && (
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Explorar todos
              </Link>
              <Link
                href={`/business-requests?name=${encodeURIComponent(params.q || "")}`}
                className="rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)]"
              >
                Solicitar este negocio
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
