import Link from "next/link";
import type { Metadata } from "next";
import { Check, Package, Smartphone, MessageSquare, Zap, MousePointerClick, BarChart3, ShieldCheck } from "lucide-react";
import { ReviewCard3D } from "@/components/marketing/ReviewCard3D";
import { NfcSimulators } from "@/components/marketing/NfcSimulators";
import { PlatformPreviews } from "@/components/marketing/PlatformPreviews";
import { PricingSection } from "@/components/marketing/PricingSection";
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
  { icon: ShieldCheck, title: "Reseñas verificadas", desc: "Cada tap genera un enlace único que caduca. Cero reseñas falsas por links compartidos." },
];

const steps = [
  {
    icon: Package,
    title: "Coloca tus NFC",
    desc: "Recibes el NFC de Google y los tags personalizados para cada empleado.",
  },
  {
    icon: Smartphone,
    title: "El cliente acerca su teléfono",
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
  "Cada valoración viene de un tap real: el enlace caduca a los pocos minutos",
];

const teamBenefits = [
  "Consulta sus propias valoraciones",
  "Sigue su evolución mes a mes",
  "Recibe feedback concreto de los clientes",
  "Participa en dinámicas de reconocimiento interno",
];

const faqs = [
  {
    q: "¿Necesitan mis clientes descargar una aplicación?",
    a: "No. El NFC abre un enlace compatible con el teléfono del cliente. En algunos dispositivos puede ser necesario activar NFC o desbloquear el teléfono.",
  },
  {
    q: "¿Las reseñas del tipo A se publican en Google?",
    a: "Sí. El tag abre directamente el formulario de reseña de Google de tu negocio (el enlace oficial de Google Reviews/Maps). El cliente escribe ahí mismo y su reseña queda publicada en tu ficha de Google.",
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
    q: "¿Alguien puede compartir el enlace del NFC para inflar las reseñas?",
    a: "No. Cada vez que un teléfono toca el tag se genera un enlace único que caduca en pocos minutos. Si alguien lo comparte o lo reutiliza, el enlace ya no funciona — solo cuentan los taps reales.",
  },
  {
    q: "¿Puedo cambiar de plan si mi equipo crece?",
    a: "Sí. Puedes subir de plan en cualquier momento y solo pagas la diferencia de instalación por los NFC adicionales que necesites.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)] px-4 py-10 sm:px-6 md:py-24">
      <JsonLd />
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero */}
        <section className="mb-10 grid items-center gap-8 md:mb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary-dark)]">
              Cada experiencia cuenta. Cada toque, también.
            </p>
            <h1 className="mb-4 text-3xl font-medium tracking-tight text-[var(--foreground)] sm:text-4xl md:mb-6 md:text-6xl">
              Consigue reseñas de Google con un toque
            </h1>
            <p className="mb-6 text-base leading-relaxed text-[var(--muted-foreground)] md:mb-8 md:text-xl">
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
        <section className="mb-10 grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:grid-cols-2 sm:p-6 md:mb-20 lg:grid-cols-4">
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
        <section id="como-funciona" className="mb-10 scroll-mt-20 rounded-3xl bg-[var(--secondary)] p-5 sm:p-8 md:mb-20 md:p-12">
          <div className="mb-6 text-center md:mb-10">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)] md:text-base">
              De la atención al feedback en segundos.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-8">
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
        <section id="nfc" className="mb-10 scroll-mt-20 md:mb-20">
          <div className="mb-6 text-center md:mb-10">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
              Dos NFC. Dos objetivos. Una plataforma.
            </h2>
          </div>
          <NfcSimulators />
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="mb-10 scroll-mt-20 rounded-3xl border border-[var(--border)] p-5 sm:p-8 md:mb-20 md:p-12">
          <div className="mb-6 text-center md:mb-10">
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
        </section>

        {/* Plataforma */}
        <div id="plataforma" className="scroll-mt-20">
          <PlatformPreviews />
        </div>

        {/* Precios */}
        <section id="precios" className="mb-10 mt-10 scroll-mt-20 md:mb-20 md:mt-20">
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

          <PricingSection />
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-10 scroll-mt-20 rounded-3xl border border-[var(--border)] p-5 sm:p-8 md:mb-20 md:p-12">
          <h2 className="mb-6 text-center text-2xl font-medium tracking-tight text-[var(--foreground)] md:mb-8 md:text-3xl">
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
        <section className="rounded-3xl bg-[var(--secondary)] p-6 text-center sm:p-8 md:p-14">
          <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
            Tu próximo buen servicio empieza con un toque.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
            Facilita las reseñas, escucha a tus clientes y reconoce el trabajo de tu equipo con Toque.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-8">
            <Link
              href="/business-requests"
              className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
            >
              Solicitar NFCs para mi negocio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
