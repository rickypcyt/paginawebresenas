import { redirect } from "next/navigation";
import { Building2, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function EmployeePage() {
  const session = await getSession();
  if (!session?.user) redirect("/?redirect=/employee");

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
    include: {
      business: { select: { name: true, city: true } },
      reviews: { select: { rating: true } },
    },
  });
  if (!employee) redirect("/employee/join");

  const average = employee.reviews.length
    ? employee.reviews.reduce((sum, review) => sum + review.rating, 0) / employee.reviews.length
    : 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-[var(--primary-dark)]">Mi Toque</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Hola, {employee.name}</h1>
      </div>
      <section className="grid gap-4 sm:grid-cols-2">
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
    </main>
  );
}
