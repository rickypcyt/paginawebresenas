import Link from "next/link";
import prisma from "@/lib/prisma";
import { BusinessCard } from "../components/BusinessCard";
import { CategoryCard } from "../components/CategoryCard";
import {
  QrCode,
  MapPin,
  Star,
  Gift,
  ShieldCheck,
  TrendingUp,
  Users,
  Store,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [categories, featuredBusinesses, reviewCount, businessCount] = await Promise.all([
    prisma.category.findMany({ take: 6, orderBy: { name: "asc" } }),
    prisma.business.findMany({
      where: { status: { in: ["community", "verified", "premium"] } },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        reviews: { select: { rating: true } },
      },
    }),
    prisma.review.count(),
    prisma.business.count({ where: { status: { in: ["community", "verified", "premium"] } } }),
  ]);

  const featured = featuredBusinesses.map((b) => ({
    ...b,
    rating: b.reviews.length
      ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
      : 0,
    reviewCount: b.reviews.length,
  }));

  const testimonials = [
    {
      text: "Volví porque conseguí un café gratis después de varias visitas. Los descuentos son de verdad.",
      author: "Usuario de la comunidad",
    },
    {
      text: "Por fin recibimos reseñas de clientes que realmente estuvieron aquí. No más opiniones falsas.",
      author: "Dueño de cafetería",
    },
    {
      text: "Encontré varios restaurantes nuevos gracias a las recomendaciones verificadas.",
      author: "Usuario de la comunidad",
    },
  ];

  const faqs = [
    {
      q: "¿Cómo sabéis que las reseñas son reales?",
      a: "Solo puedes opinar después de escanear el código QR del local o verificar tu ubicación. Si no estuviste allí, no puedes dejar reseña.",
    },
    {
      q: "¿Qué gano yo al dejar reseñas?",
      a: "Cada visita verificada suma puntos. Cuando acumulas enough, los canjeas por descuentos y promociones en los negocios colaboradores.",
    },
    {
      q: "¿Cuánto cuesta para mi negocio?",
      a: "El registro es gratuito. Hay un plan premium con analíticas detalladas y promociones destacadas, pero puedes empezar sin pagar nada.",
    },
    {
      q: "¿Cómo verificáis las visitas?",
      a: "Dos métodos: geolocalización (comprobamos que estás dentro del radio del negocio) y códigos QR (cada local tiene uno único que cambia periódicamente).",
    },
    {
      q: "¿Es gratis para los usuarios?",
      a: "Sí, completamente. Solo necesitas una cuenta para descubrir, visitar y acumular puntos.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-4 py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] md:text-5xl">
            Reseñas que puedes creer.
            <br />
            <span className="text-[var(--primary)]">Beneficios que puedes usar.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
            Internet está lleno de reseñas escritas desde casa. Aquí solo cuentan
            las opiniones de quienes realmente estuvieron en el negocio. Escaneas
            el QR del local, dejas tu opinión y consigues descuentos por compartir
            experiencias reales.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/home"
              className="rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-bold text-[var(--primary-foreground)] shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]"
            >
              Explorar negocios
            </Link>
            <Link
              href="/business-requests"
              className="rounded-xl border border-[var(--primary)] bg-white px-8 py-3.5 text-base font-semibold text-[var(--primary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-light)]"
            >
              Registrar mi negocio
            </Link>
          </div>
        </div>
      </section>

      {/* ── El problema ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            ¿Por qué confiar en estas reseñas?
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-[var(--muted-foreground)]">
            <p>
              Hoy cualquiera puede dejar una reseña aunque nunca haya entrado al
              local. Las estrellas en Google Maps no distinguen entre alguien que
              comió ahí y alguien que se enfadó por un post en redes.
            </p>
            <p>
              En DescubreLocal solo puedes opinar <strong className="text-[var(--foreground)]">después de escanear el QR del negocio</strong> o
              verificar tu ubicación. Así las reseñas tienen más credibilidad, los
              negocios reciben feedback honesto, y los clientes consiguen
              recompensas por compartir experiencias reales.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="bg-[var(--muted)] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            Cómo funciona
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
                  Visita el negocio
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  Cuando llegues, busca el código QR del local. Está en la barra,
                  en la mesa o en la entrada.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
                  Escanea el código
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  Con la cámara de tu móvil verificas que estuviste ahí. Sin
                  check-in no hay reseña. Así de simple.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
                  Escribe tu opinión
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  Solo las personas que verificaron su visita pueden publicar.
                  Tu reseña tiene más peso porque sabemos que estuviste allí.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
                  Consigue puntos
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  Cada visita verificada suma puntos que puedes cambiar por
                  descuentos y promociones en los negocios colaboradores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Negocios destacados ── */}
      {featured.length > 0 && (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Negocios en la comunidad
            </h2>
            <p className="mb-10 text-[var(--muted-foreground)]">
              {businessCount > 0
                ? `${businessCount} negocio${businessCount === 1 ? "" : "s"} verificado${businessCount === 1 ? "" : "s"} y creciendo.`
                : "Cada semana se suman más."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/negocios"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
              >
                Ver todos los negocios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Categorías ── */}
      {categories.length > 0 && (
        <section className="bg-[var(--muted)] px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Explora por categoría
            </h2>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Beneficios concretos ── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Users className="h-6 w-6 text-[var(--primary)]" />
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  Para usuarios
                </h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Solo ves reseñas de personas que realmente estuvieron allí.",
                  "Consigue descuentos por visitar negocios.",
                  "Acumula puntos cada vez que haces check-in.",
                  "Encuentra locales nuevos sin depender de reseñas falsas.",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
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
              <div className="mb-6 flex items-center gap-3">
                <Store className="h-6 w-6 text-[var(--primary)]" />
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  Para negocios
                </h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Recibe reseñas de clientes que de verdad entraron a tu local.",
                  "Publica ofertas que solo tus clientes pueden canjear.",
                  "Fideliza con puntos y recompensas por visita.",
                  "Mira cuántas visitas verificadas recibes cada semana.",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
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

      {/* ── Prueba social ── */}
      {reviewCount > 0 && (
        <section className="bg-[var(--muted)] px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
              Lo que dicen en la comunidad
            </h2>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
                >
                  <p className="mb-3 text-lg leading-relaxed text-[var(--foreground)]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <footer className="text-sm text-[var(--muted-foreground)]">
                    — {t.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section id="faq" className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
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
                  <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform group-open:rotate-180" />
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
            Empieza a visitar, opinar y ahorrar
          </h2>
          <p className="mb-6 text-white/80">
            Crea tu cuenta y descubre negocios verificados cerca de ti. Es gratis.
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
