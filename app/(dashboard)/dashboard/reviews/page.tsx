import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "@/components/reviews/ReviewCard";

interface DashboardReviewsPageProps {
  searchParams: Promise<{ employee?: string }>;
}

export default async function DashboardReviewsPage({ searchParams }: DashboardReviewsPageProps) {
  const session = await getSession();
  const { employee: employeeFilter } = await searchParams;
  const businesses = await prisma.business.findMany({
    where: { ownerId: session?.user?.id },
    select: { id: true, employees: { select: { id: true, name: true }, orderBy: { name: "asc" } } },
  });
  const businessIds = businesses.map((b) => b.id);
  const employees = businesses.flatMap((b) => b.employees);
  const selectedEmployee = employees.find((e) => e.id === employeeFilter) ?? null;

  const reviews = await prisma.review.findMany({
    where: {
      businessId: { in: businessIds },
      ...(selectedEmployee ? { employeeId: selectedEmployee.id } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      business: { select: { name: true } },
      employee: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Reseñas de tus negocios</h1>
      {employees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/reviews"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              !selectedEmployee
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            Todos
          </Link>
          {employees.map((employee) => (
            <Link
              key={employee.id}
              href={`/dashboard/reviews?employee=${employee.id}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedEmployee?.id === employee.id
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {employee.name}
            </Link>
          ))}
        </div>
      )}
      {reviews.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no hay reseñas.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
