import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/ui/EmptyState";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import {
  Star,
  TrendingUp,
  MousePointerClick,
  MessageSquareText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface DashboardHomePageProps {
  searchParams: Promise<{ businessId?: string; period?: string }>;
}

type Period = "this-month" | "last-month" | "last-30-days" | "all-time";

const validPeriods = new Set<Period>(["this-month", "last-month", "last-30-days", "all-time"]);

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getPeriodRange(period: Period, now: Date) {
  if (period === "all-time") return null;
  if (period === "last-30-days") {
    return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
  }
  if (period === "last-month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: startOfMonth(now),
    };
  }
  return {
    start: startOfMonth(now),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

function isInRange(date: Date, range: ReturnType<typeof getPeriodRange>) {
  return !range || (date >= range.start && date < range.end);
}

function getPreviousRange(range: Exclude<ReturnType<typeof getPeriodRange>, null>) {
  const duration = range.end.getTime() - range.start.getTime();
  return { start: new Date(range.start.getTime() - duration), end: range.start };
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
          description="Solicita la activación de tu negocio y nuestro equipo lo dará de alta."
          actionLabel="Solicitar negocio"
          actionHref="/business-requests"
        />
      </div>
    );
  }

  const query = await searchParams;
  const selectedId = businesses.some((b) => b.id === query.businessId)
    ? query.businessId
    : businesses[0].id;
  const period = validPeriods.has(query.period as Period) ? (query.period as Period) : "this-month";

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
  const periodRange = getPeriodRange(period, now);
  const previousRange = periodRange ? getPreviousRange(periodRange) : null;
  const allInternalReviews = business.reviews.filter((r) => r.employeeId != null);
  const internalReviews = allInternalReviews.filter((r) => isInRange(r.createdAt, periodRange));
  const previousInternalReviews = previousRange
    ? allInternalReviews.filter((r) => isInRange(r.createdAt, previousRange))
    : [];
  const internalCount = internalReviews.length;
  const internalAvg =
    internalCount > 0
      ? internalReviews.reduce((sum, review) => sum + review.rating, 0) / internalCount
      : 0;

  const typeATags = business.nfcTags.filter((tag) => tag.type === "business_google");
  const typeBTags = business.nfcTags.filter((tag) => tag.type === "employee_review");
  const typeATokens = typeATags.map((tag) => tag.token);

  const employeeStats = business.employees
    .map((employee) => {
      const reviews = employee.reviews.filter((review) => isInRange(review.createdAt, periodRange));
      const total = reviews.length;
      const good = reviews.filter((review) => review.rating >= 4).length;
      const bad = reviews.filter((review) => review.rating <= 2).length;
      const avg = total > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
      const percent = total > 0 ? Math.round((good / total) * 100) : 0;
      return {
        id: employee.id,
        name: employee.name,
        initials: employee.name
          .split(" ")
          .map((word) => word[0])
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
    .filter((employee) => employee.total > 0)
    .sort((a, b) => b.avg - a.avg || b.good - a.good)
    .slice(0, 3);

  const createdAt = periodRange
    ? { gte: periodRange.start, lt: periodRange.end }
    : undefined;
  const [generalTaps, visits] = await Promise.all([
    typeATokens.length > 0
      ? prisma.visit.count({
          where: { businessId: business.id, token: { in: typeATokens }, createdAt },
        })
      : 0,
    prisma.visit.findMany({
      where: { businessId: business.id, createdAt },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, token: true, createdAt: true },
    }),
  ]);

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

  const reviewEvents = business.reviews.filter((review) => isInRange(review.createdAt, periodRange)).slice(0, 8).map((r) => {
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

  const trendDiff = periodRange
    ? internalReviews.length - previousInternalReviews.length
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vista actual</h1>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {business.name}
        </p>
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
          <PeriodSelector value={period} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Reseñas internas (tipo B)</p>
                <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">{internalCount}</p>
                {trendDiff !== null && trendDiff !== 0 && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--primary-dark)]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {trendDiff > 0 ? `+${trendDiff}` : trendDiff} vs. periodo anterior
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
          <h2 className="text-lg font-bold text-[var(--foreground)]">Top del periodo</h2>
          <Link
            href="/dashboard/team"
            className="flex items-center gap-1 text-sm font-medium text-[var(--primary-dark)] hover:underline"
          >
            Ranking completo en &quot;Personal y ranking&quot; <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {employeeStats.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no hay reseñas internas en este periodo.
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
