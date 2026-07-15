import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardStatsPage() {
  const session = await getSession();
  const businessIds = (
    await prisma.business.findMany({
      where: { ownerId: session?.user?.id },
      select: { id: true },
    })
  ).map((b) => b.id);

  const [reviewCount, offerCount, redemptionCount] = await Promise.all([
    prisma.review.count({ where: { businessId: { in: businessIds } } }),
    prisma.offer.count({ where: { businessId: { in: businessIds } } }),
    prisma.offerRedemption.count({
      where: { offer: { businessId: { in: businessIds } } },
    }),
  ]);

  const stats = [
    { label: "Reseñas", value: reviewCount },
    { label: "Ofertas", value: offerCount },
    { label: "Reclamaciones", value: redemptionCount },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Estadísticas</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"
          >
            <p className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
