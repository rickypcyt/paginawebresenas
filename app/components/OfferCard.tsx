import Link from "next/link";

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description?: string | null;
    discountValue?: string | null;
    endDate?: Date | null;
    business: { name: string; slug: string };
  };
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Link
      href={`/offer/${offer.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-28 items-center justify-center bg-[var(--primary-light)] text-3xl">
        🎁
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {offer.title}
          </h3>
          {offer.discountValue && (
            <span className="rounded-lg bg-[var(--primary)] px-2 py-1 text-xs font-bold text-[var(--primary-foreground)]">
              {offer.discountValue}
            </span>
          )}
        </div>
        <p className="mb-2 text-sm font-medium text-[var(--primary-dark)]">
          {offer.business.name}
        </p>
        {offer.description && (
          <p className="mb-3 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {offer.description}
          </p>
        )}
        {offer.endDate && (
          <p className="mt-auto text-xs text-[var(--muted-foreground)]">
            Finaliza el {new Date(offer.endDate).toLocaleDateString("es-ES")}
          </p>
        )}
      </div>
    </Link>
  );
}
