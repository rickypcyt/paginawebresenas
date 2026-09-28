import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { Star, TrendingUp, Nfc } from "lucide-react";
import { EmployeeNfcLink } from "@/components/dashboard/EmployeeNfcLink";

export default async function DashboardTeamPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.user.id },
    include: {
      employees: {
        include: {
          reviews: { select: { id: true, rating: true, createdAt: true } },
          nfcTags: { where: { type: "employee_review" }, select: { token: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ranking del equipo</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Solicita la activación de tu negocio y nuestro equipo lo dará de alta."
          actionLabel="Solicitar negocio"
          actionHref="/business-requests"
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
        nfcToken: e.nfcTags[0]?.token ?? null,
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
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ranking del equipo</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">¿Quién tiene el toque? Tu equipo ordenado por valoración.</p>
      </div>

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
                <Link
                  href={`/dashboard/reviews?employee=${emp.id}`}
                  className="truncate text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary-dark)] hover:underline"
                >
                  {emp.name}
                </Link>
                <p className="text-xs text-[var(--muted-foreground)]">{emp.businessName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[var(--primary-dark)]">
                    <Star className="h-3 w-3" /> {emp.good} buenas
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--destructive-light)] px-2 py-0.5 text-[var(--destructive)]">
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

      {employees.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-1 flex items-center gap-2">
            <Nfc className="h-5 w-5 text-[var(--primary-dark)]" />
            <h2 className="font-semibold text-[var(--foreground)]">Links NFC del equipo</h2>
          </div>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            Graba esta URL en el NFC de cada colaborador. Al acercar el móvil se abre el formulario de reseña con su nombre preseleccionado.
          </p>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{emp.name}</p>
                  <p className="shrink-0 text-xs text-[var(--muted-foreground)]">{emp.businessName}</p>
                </div>
                <EmployeeNfcLink employeeId={emp.id} token={emp.nfcToken} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
