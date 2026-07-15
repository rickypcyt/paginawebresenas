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
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5]">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
            alt={business.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl opacity-80 transition-transform duration-200 group-hover:scale-110">🏪</span>
        )}
        {business.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[var(--primary-dark)] shadow-sm backdrop-blur">
            {business.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)]">
          {business.name}
        </h3>
        {business.city && (
          <p className="mb-2 mt-0.5 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <span>📍</span> {business.city}
          </p>
        )}
        {business.description && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {business.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-2 py-1 text-xs font-semibold text-[var(--accent-foreground)]">
            <span>⭐</span>
            {rating > 0 ? rating.toFixed(1) : "Nuevo"}
          </div>
          {reviewCount > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">({reviewCount} reseñas)</span>
          )}
        </div>
      </div>
    </Link>
  );
}
