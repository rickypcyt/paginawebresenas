import Link from "next/link";
import { StarRating } from "./StarRating";

interface BusinessCardProps {
  business: {
    id: string;
    slug: string;
    name: string;
    imageUrl?: string | null;
    category?: { name: string } | null;
    city?: string | null;
    rating?: number;
    reviewCount?: number;
    description?: string | null;
  };
}

export function BusinessCard({ business }: BusinessCardProps) {
  const rating = business.rating ?? 0;
  const reviewCount = business.reviewCount ?? 0;

  return (
    <Link
      href={`/business/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[var(--primary-light)]">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
            alt={business.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl opacity-60">🏪</span>
        )}
        {business.category && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-[var(--primary-dark)] backdrop-blur">
            {business.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
          {business.name}
        </h3>

        {business.city && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <span>📍</span> {business.city}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-3">
          {rating > 0 ? (
            <>
              <StarRating rating={rating} />
              <span className="text-xs font-medium text-[var(--foreground)]">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                · {reviewCount} reseña{reviewCount === 1 ? "" : "s"}
              </span>
            </>
          ) : (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
              ✨ Nuevo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
