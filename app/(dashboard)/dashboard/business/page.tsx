import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardBusinessPage() {
  const session = await getSession();
  const businesses = await prisma.business.findMany({
    where: { ownerId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      nfcTags: {
        where: { active: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, token: true, label: true, type: true, scanCount: true },
      },
    },
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
            <div key={b.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <Link href={`/business/${b.slug}`} className="flex items-center justify-between hover:text-[var(--primary)]">
                <div>
                  <h2 className="font-semibold text-[var(--foreground)]">{b.name}</h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {b.status === "community" && "👥 Comunidad"}
                    {b.status === "claim_pending" && "⏳ Reclamación pendiente"}
                    {b.status === "verified" && "✅ Verificado"}
                    {b.status === "premium" && "💎 Premium"}
                  </p>
                </div>
                <span className="text-[var(--primary)]">Ver negocio →</span>
              </Link>
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">Tus NFC</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">Cada NFC lleva a una acción de reseña concreta.</p>
                  </div>
                  <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
                    {b.nfcTags.length} activos
                  </span>
                </div>
                {b.nfcTags.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Aún no hay NFC asignados.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {b.nfcTags.map((tag) => (
                      <div key={tag.id} className="rounded-xl border border-[var(--border)] p-3">
                        <p className="text-sm font-medium text-[var(--foreground)]">{tag.label}</p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {tag.type === "business_google" ? "Google del negocio" : "Reseña de empleado"} · {tag.scanCount} lecturas
                        </p>
                        <code className="mt-2 block truncate text-[10px] text-[var(--muted-foreground)]">
                          {typeof window === "undefined" ? `/nfc/${tag.token}` : `${window.location.origin}/nfc/${tag.token}`}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
