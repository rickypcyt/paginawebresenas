import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BusinessRequestForm } from "./BusinessRequestForm";
import { SupportButton } from "./SupportButton";

interface BusinessRequestsPageProps {
  searchParams: Promise<{ name?: string }>;
}

export default async function BusinessRequestsPage({ searchParams }: BusinessRequestsPageProps) {
  const params = await searchParams;
  const initialName = params.name || "";
  const session = await getSession();
  const userId = session?.user?.id;

  const [requests, categories] = await Promise.all([
    prisma.businessRequest.findMany({
      where: { status: { not: "rejected" } },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { supporters: true } },
        requester: { select: { name: true } },
        supporters: { select: { userId: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">Solicitar negocios</h1>
      <p className="mb-6 text-[var(--muted-foreground)]">
        ¿Echas de menos un negocio? Solicítalo y otros usuarios pueden apoyar para traerlo a la plataforma.
      </p>

      <BusinessRequestForm categories={categories} initialName={initialName} />

      <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Pendientes</h2>
      {requests.length === 0 ? (
        <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-foreground)]">
          Aún no hay solicitudes. Sé el primero.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const count = req._count.supporters;
            const supported = userId ? req.supporters.some((s) => s.userId === userId) : false;
            return (
              <div
                key={req.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">{req.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {req.categoryName || "Sin categoría"}
                    {req.city && ` · ${req.city}`}
                    {req.address && ` · ${req.address}`}
                  </p>
                  {req.description && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{req.description}</p>
                  )}
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Solicitado por {req.requester.name || "Anónimo"}
                  </p>
                </div>
                <SupportButton
                  requestId={req.id}
                  initialSupported={supported}
                  count={count}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
