import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Usuarios</h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Nombre</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Email</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-[var(--foreground)]">{user.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
