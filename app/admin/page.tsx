import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [users, businesses, reviews, offers] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.review.count(),
    prisma.offer.count(),
  ]);

  const stats = [
    { label: "Usuarios", value: users },
    { label: "Negocios", value: businesses },
    { label: "Reseñas", value: reviews },
    { label: "Ofertas", value: offers },
  ];

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Panel de administración</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4 text-center"
          >
            <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
