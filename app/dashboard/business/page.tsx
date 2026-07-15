import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardBusinessPage() {
  const session = await getSession();
  const businesses = await prisma.business.findMany({
    where: { ownerId: session?.user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mi negocio</h1>
        <Link
          href="/businesses/new"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
        >
          Crear negocio
        </Link>
      </div>
      {businesses.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">Aún no tienes negocios registrados.</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Desde el perfil puedes importar datos de Google Maps y crear tu negocio.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {businesses.map((b) => (
            <Link
              key={b.id}
              href={`/business/${b.slug}`}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]"
            >
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">{b.name}</h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {b.status === "community" && "👥 Comunidad"}
                  {b.status === "claim_pending" && "⏳ Reclamación pendiente"}
                  {b.status === "verified" && "✅ Verificado"}
                  {b.status === "premium" && "💎 Premium"}
                </p>
              </div>
              <span className="text-[var(--primary)]">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
