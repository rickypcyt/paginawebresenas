import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    content: string;
    rating: number;
    verification?: string | null;
    visit?: { createdAt: Date } | null;
    createdAt: Date;
    user?: { name?: string | null; image?: string | null } | null;
    business?: { name: string } | null;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold text-[var(--muted-foreground)]">
            {review.user?.name?.charAt(0).toUpperCase() || "👤"}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {review.user?.name || "Usuario"}
            </p>
            {review.business && (
              <p className="text-xs text-[var(--muted-foreground)]">
                {review.business.name}
              </p>
            )}
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <h4 className="mb-1 font-semibold text-[var(--foreground)]">{review.title}</h4>
      <p className="mb-3 text-sm text-[var(--muted-foreground)]">{review.content}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        {review.verification && review.verification !== "none" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
            <span>✓</span>
            {review.verification === "location" && "Visita verificada por ubicación"}
            {review.verification === "qr" && "Visita verificada por QR"}
            {review.verification === "integration" && "Visita verificada"}
            {review.visit && (
              <span className="ml-1 text-green-600">
                {new Date(review.visit.createdAt).toLocaleDateString("es-ES")}
              </span>
            )}
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
            Reseña no verificada
          </span>
        )}
        <span>·</span>
        <span>{new Date(review.createdAt).toLocaleDateString("es-ES")}</span>
      </div>
    </div>
  );
}
