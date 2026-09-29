import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { EmployeeNfcLink } from "@/components/dashboard/EmployeeNfcLink";
import { ArrowLeft, Star } from "lucide-react";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const { id } = await params;
  const employee = await prisma.employee.findFirst({
    where: { id, business: { ownerId: session.user.id } },
    include: {
      business: { select: { name: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
          business: { select: { name: true } },
        },
      },
      nfcTags: { where: { type: "employee_review" }, select: { token: true }, take: 1 },
    },
  });

  if (!employee) notFound();

  const total = employee.reviews.length;
  const avg = total > 0 ? employee.reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const good = employee.reviews.filter((r) => r.rating >= 4).length;
  const bad = employee.reviews.filter((r) => r.rating <= 2).length;
  const dist = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: employee.reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary-dark)]"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al panel
      </Link>

      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-lg font-bold text-[var(--primary-dark)]">
            {employee.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{employee.name}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {employee.role || "Colaborador"} · {employee.business.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="flex items-center gap-1 text-2xl font-bold text-[var(--foreground)]">
              {avg > 0 ? avg.toFixed(1) : "—"}
              {avg > 0 && <Star className="h-5 w-5 text-[var(--star)]" />}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--foreground)]">{total}</p>
            <p className="text-xs text-[var(--muted-foreground)]">reseñas</p>
          </div>
        </div>
      </div>

      {total > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Distribución de valoraciones</h2>
          <div className="space-y-2">
            {dist.map((d) => (
              <div key={d.rating} className="flex items-center gap-3 text-sm">
                <span className="w-8 shrink-0 text-[var(--muted-foreground)]">{d.rating}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{ width: `${total > 0 ? (d.count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[var(--muted-foreground)]">{d.count}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            {good} buenas · {bad} malas
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Link NFC de {employee.name}</h2>
        <EmployeeNfcLink employeeId={employee.id} token={employee.nfcTags[0]?.token ?? null} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">Reseñas recibidas</h2>
        {total === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Aún no ha recibido reseñas.
          </p>
        ) : (
          <div className="grid gap-4">
            {employee.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
