import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardHomePage() {
  const session = await getSession();
  const businessCount = await prisma.business.count({
    where: { ownerId: session?.user?.id },
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
      <p className="text-[var(--muted-foreground)]">
        Tienes {businessCount} negocio{businessCount === 1 ? "" : "s"} asociado
        {businessCount === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
