import prisma from "@/lib/prisma";
import { VerifyButton } from "./VerifyButton";

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { owner: { select: { name: true, email: true } }, category: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Negocios</h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Nombre</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Ciudad</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Estado</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]"></th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-[var(--foreground)]">{business.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{business.city || "—"}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {business.status === "community" && "👥 Comunidad"}
                  {business.status === "claim_pending" && "⏳ Reclamación"}
                  {business.status === "verified" && "✅ Verificado"}
                  {business.status === "premium" && "💎 Premium"}
                </td>
                <td className="px-4 py-3">
                  {business.status === "claim_pending" && <VerifyButton id={business.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
