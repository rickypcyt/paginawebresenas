import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import type { ReviewCard } from "@/components/reviews/ReviewCard";

type PanelReview = Parameters<typeof ReviewCard>[0]["review"];

interface EmployeePanelProps {
  employee: {
    id: string;
    name: string;
    role: string | null;
    business: {
      name: string;
      city: string | null;
      employees: { id: string; name: string; reviews: { rating: number }[] }[];
    };
    reviews: PanelReview[];
  };
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function EmployeePanel({ employee }: EmployeePanelProps) {
  const total = employee.reviews.length;
  const average = total
    ? employee.reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : 0;
  const positivePct = total
    ? Math.round((employee.reviews.filter((r) => r.rating >= 4).length / total) * 100)
    : 0;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const thisMonth = employee.reviews.filter((r) => new Date(r.createdAt) >= thisMonthStart);
  const lastMonth = employee.reviews.filter(
    (r) => new Date(r.createdAt) >= lastMonthStart && new Date(r.createdAt) < thisMonthStart
  );
  const thisMonthAvg = thisMonth.length
    ? thisMonth.reduce((s, r) => s + r.rating, 0) / thisMonth.length
    : 0;
  const lastMonthAvg = lastMonth.length
    ? lastMonth.reduce((s, r) => s + r.rating, 0) / lastMonth.length
    : 0;
  const monthDelta =
    thisMonthAvg > 0 && lastMonthAvg > 0 ? thisMonthAvg - lastMonthAvg : null;

  const ranking = employee.business.employees
    .map((e) => {
      const count = e.reviews.length;
      const avg = count > 0 ? e.reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
      return { id: e.id, name: e.name, count, avg };
    })
    .sort((a, b) => b.avg - a.avg || b.count - a.count);

  const myPosition = ranking.findIndex((e) => e.id === employee.id) + 1;

  return (
    <>
      <section className="mb-8">
        <p className="text-sm font-medium text-[var(--primary-dark)]">Mi Toque</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {employee.name}
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          {employee.role || "Colaborador"} · {employee.business.name}
        </p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Tu valoración</p>
          <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {average > 0 ? average.toFixed(1) : "—"}
            {average > 0 && <span className="text-2xl text-[var(--star)]">★</span>}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {total} reseña{total === 1 ? "" : "s"} recibida{total === 1 ? "" : "s"}
          </p>
          {monthDelta !== null && monthDelta !== 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--primary-dark)]">
              {monthDelta > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {monthDelta > 0 ? "+" : ""}
              {monthDelta.toFixed(1)} este mes
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Experiencias positivas</p>
          <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {total > 0 ? `${positivePct}%` : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">valoraciones de 4★ o más</p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">Posición en el equipo</p>
            <Trophy className="h-5 w-5 text-[var(--primary-dark)]" />
          </div>
          <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {myPosition > 0 ? `#${myPosition}` : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            de {employee.business.employees.length} en {employee.business.name}
          </p>
        </div>
      </section>

    </>
  );
}
