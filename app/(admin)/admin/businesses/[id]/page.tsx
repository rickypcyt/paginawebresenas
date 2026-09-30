import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { EmployeeNfcLink } from "@/components/dashboard/EmployeeNfcLink";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { AddEmployeeForm } from "./AddEmployeeForm";

interface AdminBusinessDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBusinessDetailPage({ params }: AdminBusinessDetailProps) {
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      category: { select: { name: true } },
      employees: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { email: true } },
          nfcTags: { where: { type: "employee_review" }, select: { id: true, token: true, label: true, active: true }, take: 1 },
        },
      },
      nfcTags: {
        where: { type: "business_google" },
        select: { id: true, token: true, label: true, scanCount: true, active: true },
      },
    },
  });
  if (!business) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/businesses" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]">
          ← Negocios
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-[var(--foreground)]">{business.name}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {[business.category?.name, business.city, business.address].filter(Boolean).join(" · ") || "Sin datos"}
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Propietario: {business.owner ? `${business.owner.name} (${business.owner.email})` : "sin asignar"}
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 font-semibold text-[var(--foreground)]">Equipo ({business.employees.length})</h2>
        <AddEmployeeForm businessId={business.id} />
        {business.employees.length > 0 && (
          <div className="mt-4 space-y-3">
            {business.employees.map((employee) => (
              <div key={employee.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {employee.name}
                    {employee.role && <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">{employee.role}</span>}
                    {!employee.active && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">inactivo</span>}
                  </p>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {employee.user?.email || "sin cuenta vinculada"}
                    </p>
                    <AdminEntityActions
                      endpoint={`/api/admin/employees/${employee.id}`}
                      fields={[
                        { name: "name", label: "Nombre" },
                        { name: "role", label: "Rol" },
                        { name: "active", label: "Activo", type: "checkbox" },
                      ]}
                      values={{ name: employee.name, role: employee.role, active: employee.active }}
                    />
                  </div>
                </div>
                <EmployeeNfcLink employeeId={employee.id} token={employee.nfcTags[0]?.token ?? null} />
                {employee.nfcTags[0] && (
                  <div className="mt-2">
                    <AdminEntityActions
                      endpoint={`/api/admin/nfc-tags/${employee.nfcTags[0].id}`}
                      fields={[
                        { name: "label", label: "Etiqueta" },
                        { name: "active", label: "Tag activo", type: "checkbox" },
                      ]}
                      values={{ label: employee.nfcTags[0].label, active: employee.nfcTags[0].active }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 font-semibold text-[var(--foreground)]">Tags NFC generales (Google)</h2>
        {business.nfcTags.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin tags generales.</p>
        ) : (
          <div className="space-y-2">
            {business.nfcTags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{tag.label}</p>
                  <code className="text-xs text-[var(--muted-foreground)]">/nfc/{tag.token}</code>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-[var(--muted-foreground)]">{tag.scanCount} lecturas</p>
                  <AdminEntityActions
                    endpoint={`/api/admin/nfc-tags/${tag.id}`}
                    fields={[
                      { name: "label", label: "Etiqueta" },
                      { name: "active", label: "Tag activo", type: "checkbox" },
                    ]}
                    values={{ label: tag.label, active: tag.active }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
