import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { StarRating } from "@/app/components/StarRating";
import { ReviewCard } from "@/app/components/ReviewCard";
import { OfferCard } from "@/app/components/OfferCard";
import { MapView } from "@/app/components/MapView";
import { EmptyState } from "@/app/components/EmptyState";
import { computeReviewWeight } from "@/lib/gamification";
import { VerifyVisitButtons } from "./VerifyVisitButtons";

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true, description: true, city: true, imageUrl: true, category: { select: { name: true } } },
  });

  if (!business) return { title: "Negocio no encontrado" };

  const title = business.category
    ? `${business.name} — ${business.category.name} en ${business.city || "tu ciudad"}`
    : `${business.name} — Reseñas y ofertas`;
  const description = business.description || `Descubre ${business.name}. Consulta ofertas, horarios, reseñas verificadas y promociones${business.city ? ` en ${business.city}` : ""}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/business/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: business.imageUrl ? [{ url: business.imageUrl }] : [],
      type: "website",
    },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": business.category?.name === "Restaurantes" ? "Restaurant" : "LocalBusiness",
    name: business.name,
    description: business.description || undefined,
    image: business.imageUrl || undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.city || undefined,
        }
      : undefined,
    telephone: business.phone || undefined,
    url: business.website || undefined,
    aggregateRating: business.reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          reviewCount: business.reviews.length,
        }
      : undefined,
    geo:
      business.latitude && business.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          }
        : undefined,
    openingHours: business.hours || undefined,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Header ── */}
      <div className="relative mb-6 h-44 w-full overflow-hidden rounded-3xl bg-[var(--primary-light)] md:h-60">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
            alt={business.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🏪</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* ── Nombre + rating + categoría ── */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] md:text-3xl">
            {business.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {rating > 0 ? (
              <span className="flex items-center gap-1.5">
                <StarRating rating={rating} size="md" />
                <span className="font-semibold text-[var(--foreground)]">{rating.toFixed(1)}</span>
                <span className="text-[var(--muted-foreground)]">
                  · {business.reviews.length} reseña{business.reviews.length === 1 ? "" : "s"}
                </span>
              </span>
            ) : (
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
                ✨ Sin reseñas aún
              </span>
            )}
            {business.category && (
              <Link
                href={`/categoria/${business.category.slug}`}
                className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent-foreground)] hover:bg-[var(--primary-light)]"
              >
                {business.category.name}
              </Link>
            )}
          </div>
        </div>

        {/* Acción secundaria */}
        <Link
          href={`/business/${business.slug}/review`}
          className="shrink-0 rounded-xl border border-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
        >
          ✍️ Compartir experiencia
        </Link>
      </div>

      {/* ── Acción principal: verificar visita ── */}
      {session?.user?.id && (
        <div className="mb-8">
          <VerifyVisitButtons businessId={business.id} />
        </div>
      )}

      {/* ── Información rápida con iconos ── */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {business.hours && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <span className="text-xl">🕒</span>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Horario</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{business.hours}</p>
            </div>
          </div>
        )}
        {business.address && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Dirección</p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {business.address}{business.city && `, ${business.city}`}
              </p>
            </div>
          </div>
        )}
        {business.phone && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <span className="text-xl">📞</span>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Teléfono</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{business.phone}</p>
            </div>
          </div>
        )}
        {business.website && (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <span className="text-xl">🌐</span>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Sitio web</p>
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                {business.website}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Descripción ── */}
      {business.description && (
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            {business.description}
          </p>
        </div>
      )}

      {/* ── Ofertas ── */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          🎁 Ofertas disponibles
        </h2>
        {business.offers.length === 0 ? (
          <EmptyState
            icon="🎁"
            title="No hay ofertas activas"
            description="Este negocio aún no ha publicado ofertas. Vuelve pronto para aprovechar promociones."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {business.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* ── Reseñas ── */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          💬 Reseñas de la comunidad
        </h2>
        {business.reviews.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="Aún no hay reseñas"
            description="Sé el primero en compartir tu experiencia sobre este negocio."
            actionLabel="Escribir reseña"
            actionHref={`/business/${business.slug}/review`}
          />
        ) : (
          <div className="grid gap-3">
            {business.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* ── Ubicación ── */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          🗺️ Ubicación
        </h2>
        <MapView
          latitude={business.latitude}
          longitude={business.longitude}
          address={business.address}
          city={business.city}
        />
      </section>

      {/* ── Internal linking ── */}
      <nav className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-6 text-sm">
        {business.category && (
          <Link
            href={`/categoria/${business.category.slug}`}
            className="rounded-full bg-[var(--accent)] px-3 py-1.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--primary-light)]"
          >
            Más {business.category.name.toLowerCase()}
          </Link>
        )}
        {business.city && (
          <Link
            href={`/ciudad/${business.city.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full bg-[var(--accent)] px-3 py-1.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--primary-light)]"
          >
            Más en {business.city}
          </Link>
        )}
        <Link
          href="/offers"
          className="rounded-full bg-[var(--accent)] px-3 py-1.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--primary-light)]"
        >
          🎁 Ofertas
        </Link>
      </nav>
    </div>
  );
}
