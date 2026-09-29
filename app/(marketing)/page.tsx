import Link from "next/link";
import type { Metadata } from "next";
import { Check, Package, Smartphone, MessageSquare, Zap, MousePointerClick, BarChart3 } from "lucide-react";
import { ReviewCard3D } from "@/components/marketing/ReviewCard3D";
import { NfcSimulators } from "@/components/marketing/NfcSimulators";
import { PlatformPreviews } from "@/components/marketing/PlatformPreviews";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "NFC para Reseñas de Google y Negocios",
  description:
    "Consigue más reseñas en Google y conoce la experiencia de tus clientes con Toque. NFC para negocios, feedback de empleados y panel de gestión en una sola plataforma.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Toque | Cada experiencia cuenta",
    description: "NFC para reseñas de Google y feedback de empleados.",
    url: "/",
    siteName: "Toque",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toque | NFC para negocios",
    description: "Reseñas de Google y feedback de empleados con un toque.",
  },
};

const valueProps = [
  { icon: Zap, title: "Un solo toque", desc: "Sin descargar aplicaciones." },
  { icon: MousePointerClick, title: "Acceso directo", desc: "Sin búsquedas ni pasos innecesarios." },
  { icon: BarChart3, title: "Datos accionables", desc: "Feedback para el negocio y el equipo." },
];

const steps = [
  {
    icon: Package,
    title: "Coloca tus NFC",
    desc: "Recibes el NFC de Google y los tags personalizados para cada empleado.",
  },
  {
    icon: Smartphone,
    title: "El cliente acerca su móvil",
    desc: "El teléfono detecta el chip y abre directamente la experiencia correspondiente.",
  },
  {
    icon: MessageSquare,
    title: "Recibes feedback",
    desc: "Las reseñas públicas van a Google y las valoraciones internas llegan al panel.",
  },
];

const ownerBenefits = [
  "Facilita que los clientes accedan a Google Reviews",
  "Identifica tendencias en la calidad del servicio",
  "Consulta valoraciones y rendimiento por empleado",
  "Detecta oportunidades de formación y mejora",
];

const teamBenefits = [
  "Consulta sus propias valoraciones",
  "Sigue su evolución mes a mes",
  "Recibe feedback concreto de los clientes",
  "Participa en dinámicas de reconocimiento interno",
];

const plans = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "Básico",
    employees: "1–5 empleados",
    tagPrice: "$20",
    monthly: "$19.99",
    featured: false,
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Negocio",
    employees: "6–10 empleados",
    tagPrice: "$15",
    monthly: "$29.99",
    featured: true,
  },
  {
    slug: "business-plus",
    name: "Business Plus",
    tagline: "Negocio Plus",
    employees: "11–20 empleados",
    tagPrice: "$12",
    monthly: "$49.99",
    featured: false,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    tagline: "Empresarial",
    employees: "21–50 empleados",
    tagPrice: "$10",
    monthly: "$79.99",
    featured: false,
  },
];

const faqs = [
  {
    q: "¿Necesitan mis clientes descargar una aplicación?",
    a: "No. El NFC abre un enlace compatible con el teléfono del cliente. En algunos dispositivos puede ser necesario activar NFC o desbloquear el teléfono.",
  },
  {
    q: "¿Las reseñas del tipo A se publican automáticamente en Google?",
    a: "No. El NFC dirige a la ficha de Google de tu negocio. El cliente decide si escribe y publica su reseña desde Google — nosotros solo facilitamos el acceso.",
  },
  {
    q: "¿Puede un empleado ver las valoraciones de sus compañeros?",
    a: "No. Cada empleado solo ve su propia información en su vista personal. El acceso al conjunto de datos del negocio corresponde al administrador autorizado.",
  },
  {
    q: "¿Qué ocurre si contrato o doy de baja a un empleado?",
    a: "Su NFC se puede reasignar o desactivar desde el panel. Sus valoraciones históricas se conservan para mantener las estadísticas del negocio.",
  },
  {
    q: "¿Qué incluye la instalación inicial?",
    a: "Incluye la personalización de los tags, el alta y configuración de tu negocio en la plataforma, la preparación de los NFC y el envío.",
  },
  {
    q: "¿Puedo cambiar de plan si mi equipo crece?",
    a: "Sí. Puedes subir de plan en cualquier momento y solo pagas la diferencia de instalación por los NFC adicionales que necesites.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)] px-6 py-16 md:py-24">
      <JsonLd />
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero */}
        <section className="mb-16 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary-dark)]">
              Cada experiencia cuenta. Cada toque, también.
            </p>
            <h1 className="mb-6 text-4xl font-medium tracking-tight text-[var(--foreground)] md:text-6xl">
              Consigue reseñas de Google con un toque
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
              Somos Toque: ofrecemos tags NFC y códigos QR para que tus clientes dejen su reseña en Google con un solo gesto. Además, incluimos un sistema interno de valoraciones útil tanto para empleados como para el equipo administrativo.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/business-requests"
                className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
              >
                Solicitar NFCs para mi negocio
              </Link>

            </div>
          </div>
          <ReviewCard3D />
        </section>

        {/* Barra de valor */}
        <section className="mb-20 grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:grid-cols-3">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <div key={prop.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{prop.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{prop.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="mb-20 scroll-mt-20 rounded-3xl bg-[var(--secondary)] p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)] md:text-base">
              De la atención al feedback en segundos.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dos NFC, dos experiencias */}
        <section id="nfc" className="mb-20 scroll-mt-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              Dos NFC. Dos objetivos. Una plataforma.
            </h2>
          </div>
          <NfcSimulators />
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="mb-20 scroll-mt-20 rounded-3xl border border-[var(--border)] p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              Una mejor experiencia para todos
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--secondary)] p-6">
              <h3 className="mb-4 font-semibold text-[var(--foreground)]">Para el dueño</h3>
              <ul className="space-y-3">
                {ownerBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] p-6">
              <h3 className="mb-4 font-semibold text-[var(--foreground)]">Para el equipo</h3>
              <ul className="space-y-3">
                {teamBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 text-center text-sm italic text-[var(--muted-foreground)]">
            Cada buen servicio tiene su toque.
          </p>
        </section>

        {/* Plataforma */}
        <div id="plataforma" className="scroll-mt-20">
          <PlatformPreviews />
        </div>

        {/* Precios */}
        <section id="precios" className="mb-20 mt-20 scroll-mt-20">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              Precios simples: compra tu tag o elige tu plan
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted-foreground)] md:text-base">
              El tag Tipo A se compra una sola vez. Los planes Tipo B incluyen acceso a la plataforma y un tag NFC por empleado — mientras más empleados, menor el precio por tag.
            </p>
          </div>
          <div className="mb-8 text-center text-xs text-[var(--muted-foreground)]">
            Precios en USD, impuestos no incluidos. Los tags incluyen personalización, preparación y envío.
          </div>

          {/* Tipo A — compra única */}
          <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary-dark)]">
                <MousePointerClick className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary-dark)]">
                  Tipo A · Toque Público
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  Tag NFC para Google Reviews
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  El cliente acerca su teléfono y llega directo a la ficha de Google de tu negocio. Sin suscripción.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-3xl font-bold text-[var(--foreground)]">
                $30
                <span className="text-sm font-normal text-[var(--muted-foreground)]"> pago único</span>
              </p>
              <Link
                href="/checkout?product=tag-a"
                className="mt-3 inline-block rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
              >
                Comprar tag
              </Link>
            </div>
          </div>

          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Tipo B · Toque Personal — planes por tamaño de equipo
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl p-6 ${
                  plan.featured
                    ? "border-2 border-[var(--primary)] bg-[var(--card)] shadow-[var(--shadow-lg)]"
                    : "border border-[var(--border)] bg-[var(--card)]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-[var(--primary-foreground)]">
                    Más popular
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  {plan.tagline}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--foreground)]">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {plan.employees}
                </p>
                <p className="mt-4 text-3xl font-bold text-[var(--foreground)]">
                  {plan.monthly}
                  <span className="text-sm font-normal text-[var(--muted-foreground)]">/mes</span>
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Tag por empleado: <span className="font-semibold text-[var(--foreground)]">{plan.tagPrice}</span> (pago único)
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-[var(--foreground)]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    NFC tipo B por empleado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    Panel y ranking interno
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    Reseñas internas de clientes
                  </li>
                </ul>
                <Link
                  href={`/checkout?plan=${plan.slug}`}
                  className={`mt-6 rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
                    plan.featured
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)]"
                      : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  Comprar plan
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            ¿Más de 50 empleados?{" "}
            <Link href="/business-requests" className="font-semibold text-[var(--primary-dark)] hover:underline">
              Contacta con nosotros
            </Link>{" "}
            para un presupuesto a medida.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-20 scroll-mt-20 rounded-3xl border border-[var(--border)] p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
            Preguntas frecuentes
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="float-right text-[var(--muted-foreground)] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="rounded-3xl bg-[var(--secondary)] p-8 text-center md:p-14">
          <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
            Tu próximo buen servicio empieza con un toque.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
            Facilita las reseñas, escucha a tus clientes y reconoce el trabajo de tu equipo con Toque.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/business-requests"
              className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
            >
              Solicitar NFCs para mi negocio
            </Link>
            <Link
              href="/business-requests"
              className="text-sm font-medium text-[var(--primary-dark)] hover:underline"
            >
              ¿Más de 50 personas? Contacta con nosotros
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
