import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/ui/EmptyState";
import { BusinessSelector } from "@/components/dashboard/BusinessSelector";
import {
  Star,
  TrendingUp,
  MousePointerClick,
  MessageSquareText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface DashboardHomePageProps {
  searchParams: Promise<{ businessId?: string }>;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(d: Date, month: Date) {
  return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
}

function relativeTime(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "hace un momento";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export default async function DashboardHomePage({
  searchParams,
}: DashboardHomePageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, city: true },
    orderBy: { createdAt: "desc" },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vista actual</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Registra tu negocio para empezar a gestionar tus NFCs y reseñas."
          actionLabel="Registrar negocio"
          actionHref="/businesses/new"
        />
      </div>
    );
  }

  const query = await searchParams;
  const selectedId = businesses.some((b) => b.id === query.businessId)
    ? query.businessId
    : businesses[0].id;

  const business = await prisma.business.findUnique({
    where: { id: selectedId },
    include: {
      employees: {
        include: {
          reviews: { select: { id: true, rating: true, createdAt: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      nfcTags: true,
      reviews: {
        select: { id: true, rating: true, employeeId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!business) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vista actual</h1>
        <p className="text-[var(--muted-foreground)]">No se encontró el negocio seleccionado.</p>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = startOfMonth(now);
  const previousMonth = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));

  const internalReviews = business.reviews.filter((r) => r.employeeId != null);
  const internalCount = internalReviews.length;
  const internalThisMonth = internalReviews.filter((r) =>
    isSameMonth(r.createdAt, currentMonth)
  );
  const internalPrevMonth = internalReviews.filter((r) =>
    isSameMonth(r.createdAt, previousMonth)
  );
  const internalAvg =
    internalCount > 0
      ? internalReviews.reduce((s, r) => s + r.rating, 0) / internalCount
      : 0;

  const typeATags = business.nfcTags.filter((t) => t.type === "business_google");
  const generalTaps = typeATags.reduce((s, t) => s + t.scanCount, 0);

  const typeBTags = business.nfcTags.filter((t) => t.type === "employee_review");

  const employeeStats = business.employees
    .map((emp) => {
      const monthReviews = emp.reviews.filter((r) => isSameMonth(r.createdAt, currentMonth));
      const total = emp.reviews.length;
      const good = emp.reviews.filter((r) => r.rating >= 4).length;
      const bad = emp.reviews.filter((r) => r.rating <= 2).length;
      const avg = total > 0 ? emp.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
      const percent = total > 0 ? Math.round((good / total) * 100) : 0;
      return {
        id: emp.id,
        name: emp.name,
        initials: emp.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        monthReviews: monthReviews.length,
        good,
        bad,
        avg,
        percent,
      };
    })
    .filter((e) => e.monthReviews > 0)
    .sort((a, b) => b.avg - a.avg || b.good - a.good)
    .slice(0, 3);

  const visits = await prisma.visit.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, token: true, createdAt: true },
  });

  const tagByToken = new Map(business.nfcTags.map((t) => [t.token, t]));

  const visitEvents = visits.map((v) => {
    const tag = v.token ? tagByToken.get(v.token) : undefined;
    let label = "Tap registrado";
    if (tag) {
      if (tag.type === "employee_review") {
        const emp = tag.employeeId
          ? business.employees.find((e) => e.id === tag.employeeId)
          : undefined;
        label = `Tap personal — ${emp?.name || tag.label}`;
      } else {
        label = `Tap general — ${tag.label}`;
      }
    }
    return { id: v.id, label, detail: undefined as string | undefined, date: v.createdAt, type: "visit" as const };
  });

  const reviewEvents = business.reviews.slice(0, 8).map((r) => {
    let label = "Reseña del negocio registrada";
    if (r.employeeId) {
      const emp = business.employees.find((e) => e.id === r.employeeId);
      label = `Reseña interna registrada — ${emp?.name || "personal"}`;
    }
    return {
      id: r.id,
      label,
      detail: `${r.rating}★`,
      date: r.createdAt,
      type: "review" as const,
    };
  });

  const activity = [...visitEvents, ...reviewEvents]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const trendDiff = internalThisMonth.length - internalPrevMonth.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vista actual</h1>
        <div className="flex items-center gap-3">
          <BusinessSelector businesses={businesses} selectedId={selectedId} />
          <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
            Sesión: dueño
          </span>
        </div>
      </div>

      {/* Resumen */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Resumen</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {business.name} · {business.city || "Sin ciudad"}
            </p>
          </div>
          <span className="text-xs font-medium text-[var(--muted-foreground)]">
            Periodo: este mes
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Reseñas internas (tipo B)</p>
                <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">{internalCount}</p>
                {trendDiff !== 0 && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--primary-dark)]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {trendDiff > 0 ? `+${trendDiff}` : trendDiff} vs. mes anterior
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
                <MessageSquareText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Rating interno promedio</p>
                <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">
                  {internalAvg > 0 ? internalAvg.toFixed(1) : "—"}
                  {internalAvg > 0 && <span className="text-lg text-[var(--muted-foreground)]">★</span>}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  de {internalCount} reseñas propias
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Taps generales (tipo A)</p>
                <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">{generalTaps}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {typeATags.map((t) => t.label).join(", ") || "sin tags configurados"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
                <MousePointerClick className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Google · agregado externo</p>
                <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">—</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Sincroniza tu ficha de Google para verlo
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                <ExternalLink className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explicación de tags */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--primary-light)] p-5">
          <h3 className="mb-2 text-base font-bold text-[var(--foreground)]">TAG TIPO A</h3>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {typeATags.length > 0 ? typeATags.map((t) => t.label).join(", ") : "Mesas, entrada, caja"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
            El tap redirige directo a tu ficha de Google. No genera datos propios — solo contamos cuántas veces se tocó.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
          <h3 className="mb-2 text-base font-bold text-[var(--foreground)]">TAG TIPO B</h3>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {typeBTags.length > 0 ? "Personal, uno por colaborador" : "Personal, uno por colaborador"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
            El tap abre nuestro propio formulario. Alimenta el ranking interno del equipo — nunca sale de esta plataforma.
          </p>
        </div>
      </section>

      {/* Top del mes */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Top del mes</h2>
          <Link
            href="/dashboard/team"
            className="flex items-center gap-1 text-sm font-medium text-[var(--primary-dark)] hover:underline"
          >
            Ranking completo en &quot;Personal y ranking&quot; <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {employeeStats.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no hay reseñas internas este mes.
          </p>
        ) : (
          <div className="space-y-3">
            {employeeStats.map((emp, idx) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-bold text-[var(--primary-dark)]">
                  #{idx + 1}
                </span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold text-[var(--foreground)]">
                  {emp.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {emp.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {emp.good} buenas · {emp.bad} malas · {emp.percent}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--foreground)]">{emp.avg.toFixed(1)}★</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actividad reciente */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">Actividad reciente</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no hay actividad reciente.
          </p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                  {item.detail && (
                    <p className="text-xs text-[var(--muted-foreground)]">{item.detail}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                  {relativeTime(item.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
