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

const verificationLabels: Record<string, { icon: string; label: string }> = {
  location: { icon: "📍", label: "Visita verificada por ubicación" },
  qr: { icon: "📱", label: "Visita verificada por QR" },
  integration: { icon: "✓", label: "Visita verificada" },
};

export function ReviewCard({ review }: ReviewCardProps) {
  const isVerified = review.verification && review.verification !== "none";
  const verification = isVerified ? verificationLabels[review.verification!] : null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-bold text-[var(--primary-dark)]">
            {review.user?.name?.charAt(0).toUpperCase() || "👤"}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
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

      <h4 className="mb-1 text-sm font-bold text-[var(--foreground)]">{review.title}</h4>
      <p className="mb-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{review.content}</p>

      <div className="flex items-center gap-2 text-xs">
        {verification ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-0.5 font-medium text-[var(--accent-foreground)]">
            <span>{verification.icon}</span>
            {verification.label}
          </span>
        ) : (
          <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[var(--muted-foreground)]">
            Sin verificación
          </span>
        )}
        <span className="text-[var(--muted-foreground)]">
          · {new Date(review.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}
