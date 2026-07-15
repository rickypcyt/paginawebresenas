import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/app/components/EmptyState";

export default async function DashboardHomePage() {
  const session = await getSession();
  const userId = session?.user?.id;

  const [businesses, visits, reviews] = await Promise.all([
    prisma.business.findMany({
      where: { ownerId: userId },
      include: { reviews: { select: { rating: true, createdAt: true } } },
    }),
    prisma.visit.count({
      where: { business: { ownerId: userId } },
    }),
    prisma.review.count({
      where: { business: { ownerId: userId } },
    }),
  ]);

  if (businesses.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Tu panel</h1>
        <EmptyState
          icon="🏪"
          title="No tienes negocios registrados"
          description="Registra tu negocio para empezar a recibir visitas, reseñas y publicar ofertas."
          actionLabel="Registrar negocio"
          actionHref="/businesses/new"
        />
      </div>
    );
  }

  const totalRating = businesses.reduce(
    (sum, b) => sum + (b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0),
    0
  );
  const avgRating = businesses.length > 0 ? totalRating / businesses.length : 0;

  const recentReviews = businesses.reduce(
    (count, b) => count + b.reviews.filter((r) => {
      const daysAgo = (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length,
    0
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Tu panel</h1>

      {/* Stats del día */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-2xl font-bold text-[var(--foreground)]">{visits}</p>
          <p className="text-sm text-[var(--muted-foreground)]">📍 Visitas totales</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-2xl font-bold text-[var(--foreground)]">{reviews}</p>
          <p className="text-sm text-[var(--muted-foreground)]">⭐ Reseñas totales</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">📊 Valoración media</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-2xl font-bold text-[var(--foreground)]">+{recentReviews}</p>
          <p className="text-sm text-[var(--muted-foreground)]">📝 Esta semana</p>
        </div>
      </div>

      {/* Acciones recomendadas */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">
          Acciones recomendadas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/campaigns"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Crear oferta</p>
              <p className="text-xs text-[var(--muted-foreground)]">Atrae más clientes</p>
            </div>
          </Link>
          <Link
            href="/dashboard/business"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            <span className="text-2xl">🏪</span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Mi negocio</p>
              <p className="text-xs text-[var(--muted-foreground)]">Editar información</p>
            </div>
          </Link>
          <Link
            href="/dashboard/reviews"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Reseñas</p>
              <p className="text-xs text-[var(--muted-foreground)]">{recentReviews} nuevas esta semana</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
