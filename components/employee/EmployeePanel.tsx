import { Building2, Star, Trophy, MessageSquareText } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";

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
    reviews: Parameters<typeof ReviewCard>[0]["review"][];
  };
}

export function EmployeePanel({ employee }: EmployeePanelProps) {
  const average = employee.reviews.length
    ? employee.reviews.reduce((sum, review) => sum + review.rating, 0) / employee.reviews.length
    : 0;

  const ranking = employee.business.employees
    .map((e) => {
      const total = e.reviews.length;
      const avg = total > 0 ? e.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
      return { id: e.id, name: e.name, total, avg };
    })
    .sort((a, b) => b.avg - a.avg || b.total - a.total);

  const myPosition = ranking.findIndex((e) => e.id === employee.id) + 1;

  return (
    <>
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <Building2 className="mb-4 h-7 w-7 text-[var(--primary-dark)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Empresa</p>
          <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{employee.business.name}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{employee.business.city || "Ciudad no indicada"}</p>
          {employee.role && <span className="mt-3 inline-block rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary-dark)]">{employee.role}</span>}
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <Star className="mb-4 h-7 w-7 text-[var(--star)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Valoración interna</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--foreground)]">{average ? `${average.toFixed(1)}★` : "—"}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{employee.reviews.length} reseñas recibidas</p>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[var(--primary-dark)]" />
          <h2 className="font-semibold text-[var(--foreground)]">Ranking de {employee.business.name}</h2>
          {myPosition > 0 && (
            <span className="ml-auto rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary-dark)]">
              Estás #{myPosition}
            </span>
          )}
        </div>
        {ranking.every((e) => e.total === 0) ? (
          <p className="text-sm text-[var(--muted-foreground)]">Aún no hay reseñas internas en tu equipo.</p>
        ) : (
          <div className="space-y-2">
            {ranking.map((e, idx) => (
              <div
                key={e.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  e.id === employee.id
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)]"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-bold text-[var(--foreground)]">
                  #{idx + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--foreground)]">
                  {e.name}{e.id === employee.id && " (tú)"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{e.total} reseñas</p>
                <p className="text-sm font-bold text-[var(--foreground)]">
                  {e.total > 0 ? `${e.avg.toFixed(1)}★` : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[var(--primary-dark)]" />
          <h2 className="font-semibold text-[var(--foreground)]">Tus comentarios</h2>
        </div>
        {employee.reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Aún no has recibido reseñas.</p>
        ) : (
          <div className="grid gap-4">
            {employee.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
