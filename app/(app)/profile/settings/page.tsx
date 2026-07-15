import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthButton } from "@/app/components/AuthButton";

export default async function ProfileSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/explore");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Configuración</h1>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-2 font-semibold text-[var(--foreground)]">Sesión</h2>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">{session.user.email}</p>
        <AuthButton />
      </div>
    </div>
  );
}
