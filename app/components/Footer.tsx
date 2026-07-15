import Link from "next/link";
import prisma from "@/lib/prisma";

export async function Footer() {
  const [categories, cities] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, take: 6, select: { name: true, slug: true } }),
    prisma.business.findMany({
      where: { city: { not: null }, status: { in: ["community", "verified", "premium"] } },
      select: { city: true },
      distinct: ["city"],
      take: 6,
    }),
  ]);

  const uniqueCities = cities.map((b) => b.city).filter((c): c is string => Boolean(c));

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-[var(--foreground)]">Reseñas Locales</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Descubre los mejores negocios, ofertas y experiencias reales en tu ciudad.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Explorar</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/explore" className="hover:text-[var(--primary)]">Todos los negocios</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[var(--primary)]">Categorías</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-[var(--primary)]">Ofertas</Link>
              </li>
              <li>
                <Link href="/business-requests" className="hover:text-[var(--primary)]">Solicitar negocio</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Categorías populares</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-[var(--primary)]">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Para negocios</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/businesses/new" className="hover:text-[var(--primary)]">Registra tu negocio</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--primary)]">¿Cómo funciona?</Link>
              </li>
            </ul>
            {uniqueCities.length > 0 && (
              <>
                <h4 className="mb-3 mt-6 text-sm font-semibold text-[var(--foreground)]">Ciudades</h4>
                <ul className="flex flex-wrap gap-2 text-sm text-[var(--muted-foreground)]">
                  {uniqueCities.map((city) => (
                    <li key={city}>
                      <Link
                        href={`/explore?city=${encodeURIComponent(city)}`}
                        className="rounded-full bg-[var(--muted)] px-2 py-1 hover:text-[var(--primary)]"
                      >
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} Reseñas Locales. Hecho en Guayaquil.</p>
          <div className="flex gap-4">
            <Link href="/how-it-works" className="hover:text-[var(--primary)]">Ayuda</Link>
            <Link href="#" className="hover:text-[var(--primary)]">Privacidad</Link>
            <Link href="#" className="hover:text-[var(--primary)]">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
