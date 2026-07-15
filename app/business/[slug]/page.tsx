import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { StarRating } from "../../components/StarRating";
import { ReviewCard } from "../../components/ReviewCard";
import { OfferCard } from "../../components/OfferCard";
import { MapView } from "../../components/MapView";
import { computeReviewWeight } from "@/lib/gamification";
import { VerifyVisitButtons } from "./VerifyVisitButtons";

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const session = await getSession();

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true, xp: true, reputation: true } },
          visit: { select: { createdAt: true } },
        },
      },
      offers: {
        where: { OR: [{ endDate: { gte: new Date() } }, { endDate: null }] },
        orderBy: { createdAt: "desc" },
        include: { business: { select: { name: true, slug: true } } },
      },
      photos: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });

  if (!business) return notFound();

  const { weightedSum, totalWeight } = business.reviews.reduce(
    (acc, r) => {
      const weight = computeReviewWeight(r.user.reputation ?? 0, r.user.xp ?? 0);
      return {
        weightedSum: acc.weightedSum + r.rating * weight,
        totalWeight: acc.totalWeight + weight,
      };
    },
    { weightedSum: 0, totalWeight: 0 }
  );
  const rating = totalWeight ? weightedSum / totalWeight : 0;

  const tabs = [
    { id: "info", label: "Información" },
    { id: "offers", label: "Ofertas" },
    { id: "reviews", label: "Reseñas" },
    { id: "photos", label: "Fotos" },
    { id: "location", label: "Ubicación" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative mb-6 h-52 w-full overflow-hidden rounded-3xl bg-[var(--primary-light)] md:h-72">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
            alt={business.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">🏪</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[var(--shadow)]">
            {business.imageUrl ? (
              <img
                src={business.imageUrl}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] md:text-3xl">
              {business.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <StarRating rating={rating} size="md" /> {rating.toFixed(1)}
              </span>
              <span>({business.reviews.length} reseñas)</span>
              {business.category && (
                <Link
                  href={`/category/${business.category.slug}`}
                  className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]"
                >
                  {business.category.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]">
            Seguir
          </button>
          <button className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]">
            Guardar
          </button>
          <Link
            href={`/business/${business.slug}/review`}
            className="rounded-xl border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            Escribir reseña
          </Link>
        </div>
      </div>

      {session?.user?.id && (
        <div className="mb-6">
          <VerifyVisitButtons businessId={business.id} />
        </div>
      )}

      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-[var(--border)] pb-1">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className="whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section id="info">
            <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">Información</h2>
            <p className="text-[var(--muted-foreground)]">{business.description || "Sin descripción."}</p>
            <div className="mt-4 grid gap-3 text-sm">
              {business.hours && (
                <p className="text-[var(--foreground)]">🕒 {business.hours}</p>
              )}
              {business.address && (
                <p className="text-[var(--foreground)]">📍 {business.address}</p>
              )}
              {business.phone && (
                <p className="text-[var(--foreground)]">📞 {business.phone}</p>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  🌐 {business.website}
                </a>
              )}
            </div>
          </section>

          <section id="offers">
            <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">Ofertas</h2>
            {business.offers.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">No hay ofertas activas.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {business.offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </section>

          <section id="reviews">
            <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">Reseñas</h2>
            {business.reviews.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">Aún no hay reseñas.</p>
            ) : (
              <div className="grid gap-4">
                {business.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>

          <section id="photos">
            <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">Fotos</h2>
            {business.photos.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">No hay fotos aún.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {business.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-2xl bg-[var(--muted)]"
                  />
                ))}
              </div>
            )}
          </section>

          <section id="location">
            <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">Ubicación</h2>
            <MapView
              latitude={business.latitude}
              longitude={business.longitude}
              address={business.address}
              city={business.city}
            />
            <p className="mt-3 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span>🗺️</span>
              {business.address || "Dirección no disponible"}
              {business.city && `, ${business.city}`}
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-3 font-semibold text-[var(--foreground)]">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Valoración</span>
                <span className="font-medium">{rating.toFixed(1)} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Reseñas</span>
                <span className="font-medium">{business.reviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Ofertas activas</span>
                <span className="font-medium">{business.offers.length}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
