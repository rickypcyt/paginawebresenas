"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import ToquePanel from "@/components/toque/ToquePanel";
import { ownerHooksTyped, employeeHooksTyped } from "@/lib/toque-hooks";
import { isAdmin, isBusiness, isEmployee } from "@/lib/roles";

export default function DashboardPanel({ initialData }: { initialData: unknown }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<unknown>(initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/");
      return;
    }
    const role = (session.user as { role?: string }).role;

    if (isAdmin(role)) {
      router.replace("/admin");
      return;
    }

    if (data) return;

    let url: string;
    if (isEmployee(role)) {
      url = "/api/toque/employee";
    } else if (isBusiness(role)) {
      const businessId = searchParams.get("businessId");
      url = businessId ? `/api/toque/owner?businessId=${businessId}` : "/api/toque/owner";
    } else {
      router.replace("/businesses");
      return;
    }

    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, [session, isPending, router, searchParams, data]);

  if (isPending || (!data && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-[var(--muted-foreground)]">Cargando panel…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-[var(--muted-foreground)]">No se pudo cargar el panel.</p>
      </div>
    );
  }

  const role = (session?.user as { role?: string } | undefined)?.role;
  if (isEmployee(role)) {
    return (
      <ToquePanel
        tag="toque-empleado"
        data={data}
        hooks={employeeHooksTyped}
        onLogout={() => signOut()}
        theme="light"
      />
    );
  }

  return (
    <ToquePanel
      tag="toque-dueno"
      data={data}
      hooks={ownerHooksTyped}
      onLogout={() => signOut()}
      theme="light"
    />
  );
}
