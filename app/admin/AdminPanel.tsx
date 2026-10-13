"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ToquePanel from "@/components/toque/ToquePanel";
import { adminHooksTyped } from "@/lib/toque-hooks";

export default function AdminPanel({ initialData }: { initialData: unknown }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [data, setData] = useState<unknown>(initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/");
      return;
    }
    if (data) return;
    fetch("/api/toque/admin", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, [session, isPending, router, data]);

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
        <p className="text-sm text-[var(--muted-foreground)]">No se pudo cargar el panel de administración.</p>
      </div>
    );
  }

  return (
    <ToquePanel
      tag="toque-admin"
      data={data}
      hooks={adminHooksTyped}
      onLogout={() => signOut()}
      theme="dark"
    />
  );
}
