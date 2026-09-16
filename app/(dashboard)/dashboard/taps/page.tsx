import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { MousePointerClick } from "lucide-react";

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

export default async function DashboardTapsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const businessIds = (
    await prisma.business.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    })
  ).map((b) => b.id);

  if (businessIds.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Toque</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Registra tu negocio para empezar a ver los taps de tus NFCs."
          actionLabel="Registrar negocio"
          actionHref="/businesses/new"
        />
      </div>
    );
  }

  const visits = await prisma.visit.findMany({
    where: { businessId: { in: businessIds } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { business: { select: { name: true } } },
  });

  const tags = await prisma.nfcTag.findMany({
    where: { businessId: { in: businessIds } },
    select: { token: true, label: true, type: true },
  });

  const tagByToken = new Map(tags.map((t) => [t.token, t]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Toque</h1>
      {visits.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no hay taps registrados.</p>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => {
            const tag = visit.token ? tagByToken.get(visit.token) : undefined;
            const label = tag ? `${tag.label} (${tag.type === "business_google" ? "tipo A" : "tipo B"})` : "Tag desconocido";
            return (
              <div
                key={visit.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
                    <MousePointerClick className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{visit.business.name}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">{relativeTime(visit.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
