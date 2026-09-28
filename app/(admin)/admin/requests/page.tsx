import prisma from "@/lib/prisma";
import { Store, UserPlus } from "lucide-react";
import { BusinessRequestActions } from "@/components/admin/BusinessRequestActions";
import { EmployeeJoinRequestActions } from "@/components/dashboard/EmployeeJoinRequestActions";

export default async function AdminRequestsPage() {
  const [businessRequests, employeeJoinRequests] = await Promise.all([
    prisma.businessRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        requester: { select: { name: true, email: true } },
        _count: { select: { supporters: true } },
      },
    }),
    prisma.employeeJoinRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { name: true, email: true } },
        business: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Solicitudes pendientes</h1>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Store className="h-5 w-5 text-[var(--primary-dark)]" />
          <h2 className="font-semibold text-[var(--foreground)]">Negocios</h2>
          <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-semibold text-[var(--primary-dark)]">{businessRequests.length}</span>
        </div>
        {businessRequests.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No hay solicitudes de negocio pendientes.</p>
        ) : (
          <div className="space-y-3">
            {businessRequests.map((request) => (
              <div key={request.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.name}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {[request.categoryName, request.city, request.address].filter(Boolean).join(" · ") || "Sin datos"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Solicita: {request.requester.name} ({request.requester.email}) · {request._count.supporters} apoyos
                  </p>
                  {request.description && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{request.description}</p>
                  )}
                </div>
                <BusinessRequestActions requestId={request.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[var(--primary-dark)]" />
          <h2 className="font-semibold text-[var(--foreground)]">Empleados</h2>
          <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-semibold text-[var(--primary-dark)]">{employeeJoinRequests.length}</span>
        </div>
        {employeeJoinRequests.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No hay solicitudes de empleado pendientes.</p>
        ) : (
          <div className="space-y-3">
            {employeeJoinRequests.map((request) => (
              <div key={request.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.user.name}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{request.user.email}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {request.business.name}{request.jobTitle ? ` · ${request.jobTitle}` : ""}
                  </p>
                </div>
                <EmployeeJoinRequestActions requestId={request.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
