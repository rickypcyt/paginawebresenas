import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";
import { EmployeePanel } from "@/components/employee/EmployeePanel";

const roleLabels: Record<string, string> = {
  user: "Usuario",
  employee: "Empleado",
  business: "Negocio",
  admin: "Admin",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/");
  }

  const [user, employee, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, role: true },
    }),
    prisma.employee.findUnique({
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
    }),
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

  const panelLink =
    user?.role === "admin"
      ? { href: "/admin", label: "Panel admin" }
      : user?.role === "business"
        ? { href: "/dashboard", label: "Mi panel" }
        : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {process.env.NODE_ENV !== "production" && <DevRoleSwitcher currentRole={user?.role} />}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
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
        {(panelLink || user?.role === "admin") && (
        <div className="flex flex-wrap gap-2">
          {panelLink && (
            <Link
              href={panelLink.href}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              {panelLink.label}
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/businesses/new"
              className="rounded-lg border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary-light)]"
            >
              Crear negocio
            </Link>
          )}
        </div>
        )}
      </div>

      {employee ? (
        <EmployeePanel employee={employee} />
      ) : user?.role === "employee" ? (
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
      ) : null}

      <section className="mb-10">
        <SectionHeader title="Mis reseñas" subtitle="Experiencias que has compartido" href="/profile/reviews" actionLabel="Ver todas" />
        {reviews.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="Todavía no has escrito reseñas"
            description="Acerca tu teléfono a un NFC Toque o visita un negocio para compartir tu experiencia."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
