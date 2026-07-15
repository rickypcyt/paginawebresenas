import prisma from "@/lib/prisma";
import { CategoryForm } from "./CategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Categorías</h1>
      <CategoryForm />
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Nombre</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Slug</th>
              <th className="px-4 py-3 font-semibold text-[var(--foreground)]">Negocios</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-[var(--foreground)]">
                  <span className="mr-2">{category.icon || "🏷️"}</span>
                  {category.name}
                </td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{category.slug}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
