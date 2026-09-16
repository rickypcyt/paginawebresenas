import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star, TrendingUp } from "lucide-react";

export default async function DashboardTeamPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.user.id },
    include: {
      employees: {
        include: {
          reviews: { select: { id: true, rating: true, createdAt: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Personal y ranking</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Registra tu negocio y añade colaboradores para ver el ranking."
          actionLabel="Registrar negocio"
          actionHref="/businesses/new"
        />
      </div>
    );
  }

  const employees = businesses.flatMap((b) =>
    b.employees.map((e) => {
      const total = e.reviews.length;
      const good = e.reviews.filter((r) => r.rating >= 4).length;
      const bad = e.reviews.filter((r) => r.rating <= 2).length;
      const avg = total > 0 ? e.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
      const percent = total > 0 ? Math.round((good / total) * 100) : 0;
      return {
        id: e.id,
        name: e.name,
        businessName: b.name,
        initials: e.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        total,
        good,
        bad,
        avg,
        percent,
      };
    })
  );

  const ranked = employees
    .filter((e) => e.total > 0)
    .sort((a, b) => b.avg - a.avg || b.good - a.good);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Personal y ranking</h1>

      {ranked.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">
          Aún no hay reseñas internas de colaboradores.
        </p>
      ) : (
        <div className="space-y-3">
          {ranked.map((emp, idx) => (
            <div
              key={emp.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-bold text-[var(--primary-dark)]">
                #{idx + 1}
              </span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold text-[var(--foreground)]">
                {emp.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{emp.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{emp.businessName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[var(--primary-dark)]">
                    <Star className="h-3 w-3" /> {emp.good} buenas
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-light)] px-2 py-0.5 text-[var(--warning)]">
                    {emp.bad} malas
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[var(--foreground)]">
                    <TrendingUp className="h-3 w-3" /> {emp.percent}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[var(--foreground)]">{emp.avg.toFixed(1)}★</p>
                <p className="text-xs text-[var(--muted-foreground)]">{emp.total} reseñas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
