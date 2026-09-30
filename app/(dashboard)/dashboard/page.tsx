import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { EmployeePanel } from "@/components/employee/EmployeePanel";
import type { AppSession } from "@/lib/session";
import {
  Star,
  TrendingUp,
  MousePointerClick,
  MessageSquareText,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  user: "Usuario",
  employee: "Empleado",
  business: "Negocio",
  admin: "Admin",
};

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

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function DashboardHomePage({
  searchParams,
}: DashboardHomePageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  });

  // El admin solo usa el panel de administración
  if (user?.role === "admin") redirect("/admin");

  if (user?.role === "user") {
    // Si ya pidió unirse a un negocio, su vista es la pantalla de espera de empleado, no la de cliente
    const pendingJoin = await prisma.employeeJoinRequest.findFirst({
      where: { userId: session.user.id, status: "pending" },
      select: { id: true },
    });
    if (pendingJoin) redirect("/employee/join");
  }

  if (user?.role === "employee" || user?.role === "user") {
    return <MemberDashboard session={session} user={user} />;
  }

  return <BusinessDashboard session={session} searchParams={searchParams} />;
}

function AccountHeader({ user }: { user: { name: string | null; email: string | null; role: string | null } | null }) {
  return (
    <div className="mb-8 flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-2xl text-white">
        {user?.name?.charAt(0).toUpperCase() || "👤"}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {user?.name || "Usuario"}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
        <span className="mt-1 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
          {roleLabels[user?.role ?? "user"] ?? user?.role}
        </span>
      </div>
    </div>
  );
}

async function MemberDashboard({
  session,
  user,
}: {
  session: NonNullable<AppSession>;
  user: { name: string | null; email: string | null; role: string | null } | null;
}) {
  const isEmployee = user?.role === "employee";

  const [employee, reviews] = await Promise.all([
    isEmployee
      ? prisma.employee.findUnique({
          where: { userId: session.user.id },
          include: {
            business: {
              select: {
                name: true,
                city: true,
                employees: {
                  include: { reviews: { select: { rating: true } } },
                },
              },
            },
            reviews: {
              orderBy: { createdAt: "desc" },
              include: {
                user: { select: { name: true, image: true } },
                business: { select: { name: true } },
              },
            },
          },
        })
      : null,
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { name: true, image: true } },
        business: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div>
      <AccountHeader user={user} />

      {isEmployee && !employee && (
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            Tu cuenta de empleado aún no está vinculada a un negocio.
          </p>
          <Link
            href="/employee/join"
            className="mt-3 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)]"
          >
            Solicitar acceso a un negocio
          </Link>
        </div>
      )}

      {isEmployee && employee ? (
        <>
          <EmployeePanel employee={employee} />
          <section className="mb-10">
            <SectionHeader title="Reseñas que has recibido" subtitle="Lo que los clientes dicen de tu atención" />
            {employee.reviews.length === 0 ? (
              <EmptyState
                icon="⭐"
                title="Aún no has recibido reseñas"
                description="Cuando un cliente acerque su teléfono a tu NFC, su valoración aparecerá aquí."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {employee.reviews.slice(0, 4).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="mb-10">
          <SectionHeader title="Mis reseñas" subtitle="Tus reseñas publicadas" href="/dashboard/reviews" actionLabel="Ver todas" />
          {reviews.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="Todavía no has escrito reseñas"
              description="Acerca tu teléfono a un NFC Toque o visita un negocio para dejar tu reseña."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

async function BusinessDashboard({
  session,
  searchParams,
}: {
  session: NonNullable<AppSession>;
  searchParams: DashboardHomePageProps["searchParams"];
}) {
  const isAdminUser = session.user.role === "admin";
  const businesses = await prisma.business.findMany({
    where: isAdminUser ? {} : { ownerId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mi negocio</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Solicita la activación de tu negocio y nuestro equipo lo dará de alta."
          actionLabel="Solicitar negocio"
          actionHref="/business-requests"
        />
        {session.user.role === "admin" && (
          <Link href="/admin" className="inline-block text-sm font-medium text-[var(--primary-dark)] hover:underline">
            Ir al panel de administración →
          </Link>
        )}
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
        orderBy: { createdAt: "desc" },
        include: {
          reviews: {
            select: { id: true, rating: true, createdAt: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      nfcTags: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          user: { select: { name: true, image: true } },
          business: { select: { name: true } },
          employee: { select: { name: true } },
        },
      },
    },
  });

  if (!business) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mi negocio</h1>
        <p className="text-[var(--muted-foreground)]">No se encontró el negocio seleccionado.</p>
      </div>
    );
  }

  const now = new Date();
  const periodRange = getPeriodRange(period, now);

  const allInternal = business.employees.flatMap((e) => e.reviews);
  const inPeriod = allInternal.filter((r) => isInRange(r.createdAt, periodRange));
  const internalAvg =
    inPeriod.length > 0
      ? inPeriod.reduce((s, r) => s + r.rating, 0) / inPeriod.length
      : 0;
  const goodPct =
    inPeriod.length > 0
      ? Math.round((inPeriod.filter((r) => r.rating >= 4).length / inPeriod.length) * 100)
      : 0;

  const generalTags = business.nfcTags.filter((t) => t.type === "business_google");
  const taps = await prisma.visit.count({
    where: { businessId: business.id, createdAt: periodRange ? { gte: periodRange.start, lt: periodRange.end } : undefined },
  });

  const employeeCards = business.employees
    .map((e) => {
      const reviews = e.reviews.filter((r) => isInRange(r.createdAt, periodRange));
      const total = reviews.length;
      const good = reviews.filter((r) => r.rating >= 4).length;
      const bad = reviews.filter((r) => r.rating <= 2).length;
      const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
      return {
        id: e.id,
        name: e.name,
        role: e.role,
        total,
        good,
        bad,
        avg,
      };
    })
    .sort((a, b) => b.avg - a.avg || b.total - a.total);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">Panel del negocio</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {business.name}
          </h1>
          {session.user.role === "admin" && (
            <Link href="/admin" className="mt-2 inline-block text-sm font-medium text-[var(--primary-dark)] hover:underline">
              Ir al panel de administración →
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {businesses.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {businesses.map((b) => (
                <Link
                  key={b.id}
                  href={`/dashboard?businessId=${b.id}&period=${period}`}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    b.id === business.id
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          )}
          <PeriodSelector value={period} />
        </div>
      </div>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Datos en vivo
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">Reseñas internas</p>
              <MessageSquareText className="h-5 w-5 text-[var(--primary-dark)]" />
            </div>
            <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">{inPeriod.length}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">Rating promedio</p>
              <Star className="h-5 w-5 text-[var(--star)]" />
            </div>
            <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">
              {internalAvg > 0 ? internalAvg.toFixed(1) : "—"}
              {internalAvg > 0 && <span className="text-xl text-[var(--star)]">★</span>}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">Taps NFC</p>
              <MousePointerClick className="h-5 w-5 text-[var(--primary-dark)]" />
            </div>
            <p className="mt-2 text-4xl font-bold text-[var(--foreground)]">{taps}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[var(--primary-dark)]" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Ranking del equipo</h2>
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Valoraciones del periodo</p>
        </div>
        {employeeCards.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no tienes empleados registrados en este negocio.
          </p>
        ) : (
          <div className="space-y-3">
            {employeeCards.map((emp, idx) => (
              <Link
                key={emp.id}
                href={`/dashboard/employees/${emp.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--primary)] hover:shadow-[var(--shadow-lg)]"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    idx === 0
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                  }`}
                >
                  #{idx + 1}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-bold text-[var(--foreground)]">
                  {initials(emp.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-dark)]">
                    {emp.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {emp.role || "Colaborador"}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-lg font-bold text-[var(--foreground)]">{emp.total}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">valoraciones</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--foreground)]">
                      {emp.total > 0 ? emp.avg.toFixed(1) : "—"}
                      {emp.total > 0 && <span className="text-sm text-[var(--star)]">★</span>}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {emp.good} buenas · {emp.bad} malas
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[var(--primary-dark)]" />
          <h2 className="text-lg font-bold text-[var(--foreground)]">Últimas reseñas</h2>
        </div>
        {business.reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no hay reseñas en este negocio.
          </p>
        ) : (
          <div className="grid gap-4">
            {business.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
