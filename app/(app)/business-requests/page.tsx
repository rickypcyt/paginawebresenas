import prisma from "@/lib/prisma";
import { BusinessRequestForm } from "./BusinessRequestForm";

export default async function BusinessContactPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Contacta con nosotros
        </h1>
        <p className="text-[var(--muted-foreground)]">
          ¿Quieres NFCs para tu negocio? Cuéntanos sobre ti y nuestro equipo te contactará para ayudarte.
        </p>
      </div>

      <BusinessRequestForm categories={categories} />
    </div>
  );
}
