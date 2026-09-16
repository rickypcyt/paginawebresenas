import Link from "next/link";

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description?: string | null;
    discountValue?: number | null;
    endDate?: Date | null;
    business: { name: string; slug: string };
  };
}

function formatExpiry(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days <= 0 && hours <= 0) return "Expirada";
  if (days === 0) return "Expira hoy";
  if (days === 1) return "Expira mañana";
  if (days <= 7) return `Expira en ${days} días`;
  return `Expira el ${endDate.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`;
}

export function OfferCard({ offer }: OfferCardProps) {
  const isExpired = offer.endDate ? new Date(offer.endDate).getTime() < Date.now() : false;
  const expiryLabel = offer.endDate ? formatExpiry(new Date(offer.endDate)) : null;
  const isUrgent = offer.endDate && !isExpired && (new Date(offer.endDate).getTime() - Date.now()) < 1000 * 60 * 60 * 24;

  return (
    <Link
      href={`/offer/${offer.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
    >
      <div className="flex h-24 items-center justify-center bg-[var(--primary-light)] text-3xl">
        🎁
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-tight text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {offer.title}
          </h3>
          {offer.discountValue != null && (
            <span className="shrink-0 rounded-lg bg-[var(--primary)] px-2 py-0.5 text-xs font-bold text-[var(--primary-foreground)]">
              {offer.discountValue}
            </span>
          )}
        </div>

        <p className="mb-2 text-xs font-medium text-[var(--primary-dark)]">
          {offer.business.name}
        </p>

        {offer.description && (
          <p className="mb-3 line-clamp-2 text-xs text-[var(--muted-foreground)]">
            {offer.description}
          </p>
        )}

        {expiryLabel && (
          <p className={`mt-auto text-xs font-medium ${isExpired ? "text-[var(--destructive)]" : isUrgent ? "text-[var(--warning)]" : "text-[var(--muted-foreground)]"}`}>
            ⏰ {expiryLabel}
          </p>
        )}
      </div>
    </Link>
  );
}
