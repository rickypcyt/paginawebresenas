import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { MousePointerClick, MessageSquareText } from "lucide-react";

export default async function DashboardNfcTagsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.user.id },
    include: {
      nfcTags: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (businesses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tags NFC</h1>
        <EmptyState
          icon="🏪"
          title="Aún no tienes negocios"
          description="Registra tu negocio para empezar a gestionar tus tags NFC."
          actionLabel="Registrar negocio"
          actionHref="/businesses/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Tags NFC</h1>
      <div className="grid gap-4">
        {businesses.map((b) => (
          <div key={b.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="mb-4 text-base font-bold text-[var(--foreground)]">{b.name}</h2>
            {b.nfcTags.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                Aún no hay tags NFC configurados.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {b.nfcTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-start justify-between rounded-xl border border-[var(--border)] p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {tag.type === "business_google" ? (
                          <MousePointerClick className="h-4 w-4 text-[var(--primary-dark)]" />
                        ) : (
                          <MessageSquareText className="h-4 w-4 text-[var(--primary-dark)]" />
                        )}
                        <p className="text-sm font-semibold text-[var(--foreground)]">{tag.label}</p>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {tag.type === "business_google" ? "Google Reviews (tipo A)" : "Reseña de empleado (tipo B)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--foreground)]">{tag.scanCount}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">lecturas</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
