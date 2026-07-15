import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "@/app/components/ReviewCard";
import { OfferCard } from "@/app/components/OfferCard";
import { BusinessCard } from "@/app/components/BusinessCard";
import { SectionHeader } from "@/app/components/SectionHeader";
import { AuthButton } from "@/app/components/AuthButton";
import { EmptyState } from "@/app/components/EmptyState";
import { getLevel, getNextLevelXp } from "@/lib/gamification";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/explore");
  }

  const [user, reviews, offers, favorites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { badges: { include: { badge: true } } },
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { name: true, image: true } },
        business: { select: { name: true } },
      },
    }),
    prisma.offerRedemption.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        offer: {
          include: { business: { select: { name: true, slug: true } } },
        },
      },
    }),
    prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        business: {
          include: {
            category: true,
            reviews: { select: { rating: true } },
          },
        },
      },
    }),
  ]);

  const favoriteBusinesses = favorites.map((f) => ({
    ...f.business,
    rating: f.business.reviews.length
      ? f.business.reviews.reduce((sum, r) => sum + r.rating, 0) / f.business.reviews.length
      : 0,
    reviewCount: f.business.reviews.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-2xl text-white">
            {user?.name?.charAt(0).toUpperCase() || "👤"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {user?.name || "Usuario"}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
              {user?.role}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AuthButton />
          <Link
            href="/businesses/new"
            className="rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            Registrar negocio
          </Link>
          {user?.role === "business" && (
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {user && (
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                Tu nivel
                <span className="cursor-help" title="Los consigues al visitar negocios y compartir experiencias verificadas.">
                  ℹ️
                </span>
              </p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {getLevel(user.xp).name} <span className="text-base font-normal text-[var(--muted-foreground)]">({user.xp} XP)</span>
              </p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Tus puntos</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{user.points}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Reputación</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{user.reputation}</p>
              </div>
            </div>
          </div>
          {(() => {
            const nextXp = getNextLevelXp(user.xp);
            const prevXp = getLevel(user.xp).minXp;
            const progress = nextXp ? ((user.xp - prevXp) / (nextXp - prevXp)) * 100 : 100;
            return (
              <div className="w-full rounded-full bg-[var(--muted)]">
                <div
                  className="h-2 rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
            );
          })()}
          {user.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.badges.map((ub) => (
                <span
                  key={ub.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-foreground)]"
                >
                  <span>{ub.badge.icon}</span>
                  {ub.badge.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Reseñas", count: reviews.length, href: "/profile/reviews" },
          { label: "Beneficios", count: offers.length, href: "/profile/offers" },
          { label: "Guardados", count: favorites.length, href: "/favorites" },
          { label: "Logros", count: user?.badges.length ?? 0, href: "/profile" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center transition-colors hover:border-[var(--primary)]"
          >
            <p className="text-2xl font-bold text-[var(--foreground)]">{item.count}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{item.label}</p>
          </Link>
        ))}
      </div>

      <section className="mb-10">
        <SectionHeader title="Mis reseñas" subtitle="Comparte tu experiencia y gana puntos" href="/profile/reviews" actionLabel="Ver todas" />
        {reviews.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="Todavía no has escrito reseñas"
            description="Visita un negocio y comparte tu experiencia para ganar puntos y subir de nivel."
            actionLabel="Explorar negocios"
            actionHref="/explore"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <SectionHeader title="Tus beneficios" subtitle="Ofertas que has reclamado" href="/profile/offers" actionLabel="Ver todas" />
        {offers.length === 0 ? (
          <EmptyState
            icon="🎁"
            title="Todavía no tienes beneficios"
            description="Visita un negocio colaborador y escanea su QR para empezar a ganar puntos."
            actionLabel="Ver ofertas disponibles"
            actionHref="/offers"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o.offer} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <SectionHeader title="Tus lugares guardados" subtitle="❤️ Guarda tus sitios favoritos" href="/favorites" actionLabel="Ver todos" />
        {favoriteBusinesses.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="No tienes lugares guardados"
            description="Guarda tus negocios favoritos para encontrarlos fácilmente cuando quieras."
            actionLabel="Descubrir negocios"
            actionHref="/explore"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
