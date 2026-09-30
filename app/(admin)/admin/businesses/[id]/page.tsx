import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { EmployeeNfcLink } from "@/components/dashboard/EmployeeNfcLink";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { BusinessNfcLink } from "./BusinessNfcLink";

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

  const businessNfcTag = await prisma.nfcTag.findFirst({
    where: { businessId: business.id, type: "business_review" },
    select: { id: true, token: true, label: true, scanCount: true, active: true },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          {business.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.imageUrl}
              alt={business.name}
              className="h-16 w-16 shrink-0 rounded-xl border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)] text-2xl font-bold text-[var(--muted-foreground)]">
              {business.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-bold text-[var(--foreground)]">{business.name}</h1>
            {[business.category?.name, business.city, business.address].filter(Boolean).length > 0 && (
              <p className="mt-0.5 break-words text-sm text-[var(--muted-foreground)]">
                {[business.category?.name, business.city, business.address].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="mt-1 break-words text-xs text-[var(--muted-foreground)]">
              Propietario: {business.owner ? `${business.owner.name} (${business.owner.email})` : "sin asignar"}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-[var(--foreground)]">NFC del negocio</h2>
          {businessNfcTag && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {businessNfcTag.scanCount} lecturas
              {!businessNfcTag.active && " · inactivo"}
            </span>
          )}
        </div>
        <BusinessNfcLink businessId={business.id} token={businessNfcTag?.token ?? null} />
        {businessNfcTag && (
          <div className="mt-3 border-t border-[var(--border)] pt-3">
            <AdminEntityActions
              endpoint={`/api/admin/nfc-tags/${businessNfcTag.id}`}
              fields={[
                { name: "label", label: "Etiqueta" },
                { name: "active", label: "Tag activo", type: "checkbox" },
              ]}
              values={{ label: businessNfcTag.label, active: businessNfcTag.active }}
            />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 font-semibold text-[var(--foreground)]">Equipo ({business.employees.length})</h2>
        {business.employees.length > 0 && (
          <div className="mt-4 space-y-3">
            {business.employees.map((employee) => (
              <div key={employee.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-[var(--foreground)]">
                      {employee.name}
                      {employee.role && <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">{employee.role}</span>}
                      {!employee.active && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">inactivo</span>}
                    </p>
                    <p className="mt-0.5 break-words text-xs text-[var(--muted-foreground)]">
                      {employee.user?.email || "sin cuenta vinculada"}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0">
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
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
                  <div className="min-w-0 flex-1">
                    <EmployeeNfcLink employeeId={employee.id} token={employee.nfcTags[0]?.token ?? null} />
                  </div>
                  {employee.nfcTags[0] && (
                    <div className="shrink-0">
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
              <div key={tag.id} className="flex flex-col gap-3 rounded-xl border border-[var(--border)] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-[var(--foreground)]">{tag.label}</p>
                  <code className="break-all text-xs text-[var(--muted-foreground)]">/nfc/{tag.token}</code>
                </div>
                <div className="flex items-center justify-end gap-3 sm:justify-start">
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
