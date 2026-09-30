"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminEntityActions } from "./AdminEntityActions";
import { ShowMore } from "./ShowMore";

const INITIAL = 5;

type EmployeeRowData = {
  id: string;
  name: string;
  role: string | null;
  active: boolean;
  business: { id: string; name: string };
  user: { name: string; email: string } | null;
};

type UnassignedUser = { id: string; name: string; email: string };

export function AdminEmployeeList({
  employees,
  businesses,
  unassigned,
}: {
  employees: EmployeeRowData[];
  businesses: { id: string; name: string }[];
  unassigned: UnassignedUser[];
}) {
  const groups = businesses
    .map((b) => ({
      business: b,
      employees: employees.filter((e) => e.business.id === b.id),
    }))
    .filter((g) => g.employees.length > 0);

  return (
    <div className="space-y-5">
      {unassigned.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Sin asignar</p>
          {unassigned.map((u) => (
            <UnassignedRow key={u.id} user={u} businesses={businesses} />
          ))}
        </div>
      )}

      {groups.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">Sin empleados asignados.</p>
      ) : (
        groups.map((g) => (
          <div key={g.business.id} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              {g.business.name}
              <span className="ml-2 rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[var(--foreground)]">{g.employees.length}</span>
            </p>
            {g.employees.slice(0, INITIAL).map((employee) => (
              <EmployeeRow key={employee.id} employee={employee} />
            ))}
            <ShowMore count={g.employees.length - INITIAL}>
              {g.employees.slice(INITIAL).map((employee) => (
                <div key={employee.id} className="mb-3">
                  <EmployeeRow employee={employee} />
                </div>
              ))}
            </ShowMore>
          </div>
        ))
      )}
    </div>
  );
}

function UnassignedRow({ user, businesses }: { user: UnassignedUser; businesses: { id: string; name: string }[] }) {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);
  const [businessId, setBusinessId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assign() {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, businessId, userId: user.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo asignar");
        return;
      }
      rowRef.current?.classList.add("hidden");
      router.refresh();
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={rowRef} className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold text-[var(--foreground)]">
          {user.name}
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Sin negocio</span>
        </p>
        <p className="break-words text-xs text-[var(--muted-foreground)]">{user.email}</p>
        {error && <p className="mt-1 text-xs text-[var(--destructive)]">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-[var(--input)] bg-white px-2 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] sm:max-w-[160px] sm:flex-none"
        >
          <option value="">Elegir negocio…</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={assign}
          disabled={!businessId || loading}
          className="shrink-0 rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-xs font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Asignando…" : "Asignar"}
        </button>
      </div>
    </div>
  );
}

function EmployeeRow({ employee }: { employee: EmployeeRowData }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-[var(--border)] p-4">
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold text-[var(--foreground)]">
          {employee.name}
          {employee.role && <span className="ml-2 font-normal text-[var(--muted-foreground)]">{employee.role}</span>}
          {!employee.active && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Inactivo</span>}
        </p>
        <p className="break-words text-xs text-[var(--muted-foreground)]">
          {employee.user ? `${employee.user.name} (${employee.user.email})` : "Sin usuario vinculado"}
        </p>
      </div>
      <div className="ml-auto shrink-0">
        <AdminEntityActions
          endpoint={`/api/admin/employees/${employee.id}`}
          fields={[
            { name: "name", label: "Nombre" },
            { name: "role", label: "Cargo" },
            { name: "active", label: "Activo", type: "checkbox" },
          ]}
          values={{ name: employee.name, role: employee.role, active: employee.active }}
        />
      </div>
    </div>
  );
}
