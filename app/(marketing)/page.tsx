import Link from "next/link";
import prisma from "@/lib/prisma";
import { BusinessCard } from "../components/BusinessCard";
import { CategoryCard } from "../components/CategoryCard";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [categories, featuredBusinesses] = await Promise.all([
    prisma.category.findMany({ take: 6, orderBy: { name: "asc" } }),
    prisma.business.findMany({
      where: { status: { in: ["community", "verified", "premium"] } },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  const featured = featuredBusinesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));

  const stats = [
    { value: "125", label: "negocios" },
    { value: "2.500", label: "usuarios" },
    { value: "4.200", label: "visitas verificadas" },
    { value: "18.000", label: "puntos entregados" },
  ];

  const userBenefits = [
    "Descubre nuevos lugares",
    "Obtén descuentos exclusivos",
    "Acumula puntos con cada visita",
    "Guarda tus favoritos",
    "Comparte experiencias reales",
  ];

  const businessBenefits = [
    "Consigue nuevos clientes",
    "Recibe reseñas verificadas",
    "Publica promociones",
    "Fideliza a tus clientes",
    "Analiza el rendimiento",
  ];

  const faqs = [
    {
      q: "¿Cómo funcionan los puntos?",
      a: "Cada vez que verificas una visita o compartes una experiencia, acumulas puntos. Cuanto más participas, más subes de nivel y más beneficios desbloqueas.",
    },
    {
      q: "¿Cómo consigo beneficios?",
      a: "Al acumular puntos canjeas ofertas exclusivas en los negocios colaboradores. Las visitas verificadas con QR o ubicación te dan más puntos.",
    },
    {
      q: "¿Los negocios pagan?",
      a: "El registro básico es gratuito. Los negocios pueden contratar un plan premium para funcionalidades avanzadas como analíticas detalladas y promociones destacadas.",
    },
    {
      q: "¿Cómo verificáis las visitas?",
      a: "Usamos dos métodos: geolocalización (comprobamos que estás cerca del negocio) y códigos QR (cada negocio tiene un QR único). Esto garantiza que las reseñas son auténticas.",
    },
    {
      q: "¿Es gratis para los usuarios?",
      a: "Sí, la aplicación es completamente gratuita para los usuarios. Solo necesitas una cuenta para empezar a descubrir, visitar y ganar puntos.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-4 py-20 text-center md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] md:text-6xl">
            Descubre lugares.
            <br />
            Obtén recompensas.
            <br />
            <span className="text-[var(--primary)]">Ayuda a tu ciudad.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-[var(--muted-foreground)]">
            No es solo otro directorio. Es una comunidad donde tus visitas
            verificadas generan confianza y te dan beneficios reales.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/home"
              className="rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-bold text-[var(--primary-foreground)] shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/negocios"
              className="rounded-xl border border-[var(--primary)] bg-white px-8 py-3.5 text-base font-semibold text-[var(--primary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-light)]"
            >
              Ver negocios
            </Link>
          </div>
        </div>

        {/* Flow illustration */}
        <div className="relative z-10 mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm font-medium">
          {[
            { icon: "👤", label: "Usuario" },
            { icon: "📱", label: "Escanea QR" },
            { icon: "✍️", label: "Comparte" },
            { icon: "⭐", label: "Gana puntos" },
            { icon: "🎁", label: "Beneficios" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {step.label}
                </span>
              </div>
              {i < 4 && <span className="text-[var(--primary)]">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            Cómo funciona
          </h2>
          <p className="mb-12 text-center text-[var(--muted-foreground)]">
            Cuatro pasos. Cero complicaciones.
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { num: "1", icon: "📍", title: "Visita un negocio", desc: "Ve a cualquier negocio colaborador." },
              { num: "2", icon: "📱", title: "Escanea su QR", desc: "Verifica tu presencia en el local." },
              { num: "3", icon: "✍️", title: "Comparte tu experiencia", desc: "Tu reseña verificada tiene más peso." },
              { num: "4", icon: "🎁", title: "Recibe beneficios", desc: "Acumula puntos y canjea ofertas." },
            ].map((step) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-bold text-[var(--primary-foreground)]">
                  {step.num}
                </span>
                <p className="mb-3 mt-2 text-4xl">{step.icon}</p>
                <h3 className="mb-1 text-sm font-bold text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beneficios para usuarios ── */}
      <section className="bg-[var(--muted)] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Para usuarios
              </h2>
              <ul className="space-y-3">
                {userBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm text-[var(--primary-foreground)]">
                      ✓
                    </span>
                    <span className="text-[var(--foreground)]">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/home"
                className="mt-8 inline-block rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-dark)]"
              >
                Empezar a descubrir
              </Link>
            </div>

            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Para negocios
              </h2>
              <ul className="space-y-3">
                {businessBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm text-[var(--accent-foreground)]">
                      ✓
                    </span>
                    <span className="text-[var(--foreground)]">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/business-requests"
                className="mt-8 inline-block rounded-xl border border-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
              >
                Quiero registrar mi negocio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categorías destacadas ── */}
      {categories.length > 0 && (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Explora por categoría
            </h2>
            <p className="mb-10 text-center text-[var(--muted-foreground)]">
              Encuentra justo lo que buscas
            </p>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Negocios destacados ── */}
      {featured.length > 0 && (
        <section className="bg-[var(--muted)] px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Negocios en la comunidad
            </h2>
            <p className="mb-10 text-center text-[var(--muted-foreground)]">
              Descubre lugares verificados con reseñas reales
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/negocios"
                className="inline-block rounded-xl border border-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
              >
                Ver todos los negocios →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Stats / Confianza ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Una comunidad en crecimiento
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-[var(--primary)] md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-[var(--muted)] px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--foreground)]">
                  {faq.q}
                  <span className="text-[var(--muted-foreground)] transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] px-8 py-12 text-center text-white">
          <h2 className="mb-3 text-3xl font-bold">
            ¿Listo para empezar?
          </h2>
          <p className="mb-6 text-white/80">
            Únete a la comunidad y empieza a descubrir, visitar y ganar.
          </p>
          <Link
            href="/home"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-base font-bold text-[var(--primary)] transition-all hover:-translate-y-0.5"
          >
            Comenzar gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
