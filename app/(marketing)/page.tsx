import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  MessageSquareText,
  MousePointerClick,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
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
  { icon: Wifi, value: "1 toque", label: "Sin instalar apps" },
  { icon: Star, value: "4.8", label: "Valoración promedio" },
  { icon: MousePointerClick, value: "+342", label: "Taps medidos" },
  { icon: ShieldCheck, value: "100%", label: "Enlaces verificados" },
];

const steps = [
  { icon: Package, title: "Recibe tus NFC", desc: "Personalizados para tu negocio y cada integrante del equipo." },
  { icon: Smartphone, title: "El cliente hace un toque", desc: "Su teléfono abre la experiencia correcta sin descargar nada." },
  { icon: MessageSquareText, title: "Convierte atención en datos", desc: "Google recibe reseñas y tu panel organiza el feedback interno." },
];

const ownerBenefits = [
  "Más clientes llegan directamente a Google Reviews",
  "Métricas claras de taps, reseñas y satisfacción",
  "Rendimiento y oportunidades de mejora por empleado",
  "NFC administrables y enlaces temporales verificados",
];

const teamBenefits = [
  "Vista privada con sus propias valoraciones",
  "Evolución mensual y posición dentro del equipo",
  "Feedback concreto para mejorar la atención",
  "Reconocimiento visible por un buen servicio",
];

const faqs = [
  ["¿El cliente necesita una aplicación?", "No. Solo acerca un teléfono compatible al NFC y la experiencia se abre en el navegador."],
  ["¿Las reseñas públicas llegan a Google?", "Sí. El Toque Público abre directamente el formulario oficial de reseñas de tu negocio."],
  ["¿El empleado puede ver información privada de otros?", "No. Su vista es personal y de solo lectura. Los datos administrativos permanecen protegidos."],
  ["¿Qué ocurre cuando cambia mi equipo?", "Puedes desactivar, reasignar o agregar NFC desde el panel sin perder el historial del negocio."],
  ["¿Se puede compartir el enlace para crear reseñas falsas?", "Cada tap genera un acceso firmado y temporal. Los enlaces reutilizados o caducados dejan de funcionar."],
  ["¿Puedo cambiar de plan?", "Sí. Puedes aumentar la capacidad cuando tu equipo crezca."],
];

function DashboardPreview() {
  const bars = [42, 58, 49, 72, 66, 86, 78];

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute -inset-8 -z-10 rounded-full bg-green-200/40 blur-3xl" />
      <div className="overflow-hidden rounded-[22px] border border-[#d2d2d7] bg-white shadow-[0_28px_70px_-30px_rgba(29,29,31,.35)]">
        <div className="flex h-14 items-center gap-3 border-b border-[#e8e8ed] px-4 sm:px-5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22c55e] text-xs font-bold text-white">T</span>
          <div><p className="text-xs text-[#6e6e73]">Panel del negocio</p><p className="text-sm font-semibold text-[#1d1d1f]">Café Luz</p></div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#15803d]"><span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />En vivo</span>
        </div>
        <div className="grid min-h-[390px] grid-cols-[72px_1fr] sm:grid-cols-[150px_1fr]">
          <aside className="border-r border-[#e8e8ed] bg-[#fafafa] p-2.5 sm:p-3">
            <p className="hidden px-2 pb-2 text-[10px] font-semibold uppercase tracking-[.08em] text-[#6e6e73] sm:block">Principal</p>
            {[BarChart3, Users, MessageSquareText, Wifi].map((Icon, index) => (
              <div key={index} className={`mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium ${index === 0 ? "bg-[#f0fdf4] text-[#15803d]" : "text-[#6e6e73]"}`}>
                <Icon className="h-4 w-4 shrink-0" /><span className="hidden sm:inline">{["Resumen", "Equipo", "Reseñas", "NFC"][index]}</span>
              </div>
            ))}
          </aside>
          <div className="min-w-0 p-4 sm:p-5">
            <div className="mb-4"><p className="text-lg font-semibold tracking-tight text-[#1d1d1f]">Buenos días, Andrea</p><p className="text-xs text-[#6e6e73]">Así está funcionando tu negocio.</p></div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[["127", "Reseñas"], ["4.8", "Promedio"], ["342", "Taps"]].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-[#e8e8ed] p-2.5 sm:p-3"><p className="text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">{value}</p><p className="truncate text-[10px] text-[#6e6e73] sm:text-xs">{label}</p></div>
              ))}
            </div>
            <div className="rounded-xl border border-[#e8e8ed] p-3.5">
              <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold text-[#1d1d1f]">Actividad semanal</p><p className="text-[10px] text-[#6e6e73]">Taps y valoraciones</p></div><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#15803d]"><TrendingUp className="h-3 w-3" />+18%</span></div>
              <div className="flex h-24 items-end gap-2 sm:h-28 sm:gap-3">
                {bars.map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-[#22c55e]" style={{ height: `${height}%`, opacity: .45 + index * .07 }} />)}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-[#6e6e73]"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -right-2 hidden w-48 rounded-2xl border border-[#bbf7d0] bg-white p-3 shadow-xl sm:block">
        <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#f0fdf4] text-[#15803d]"><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-xs font-semibold text-[#1d1d1f]">Nueva reseña</p><p className="text-[10px] text-[#6e6e73]">5 estrellas · ahora</p></div></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <JsonLd />
      <main>
        <section className="relative overflow-hidden border-b border-[#e8e8ed] px-4 py-14 sm:px-6 md:py-20 lg:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_70%_20%,rgba(34,197,94,.12),transparent_42%)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1.5 text-xs font-semibold text-[#15803d]"><Sparkles className="h-3.5 w-3.5" />Cada experiencia cuenta</span>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-5xl md:text-[64px]">Convierte un buen servicio en crecimiento real.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#6e6e73] md:text-lg">NFC para conseguir más reseñas en Google, escuchar a tus clientes y reconocer al equipo que hace posible cada experiencia.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/business-requests" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-white transition hover:bg-[#16a34a]">Solicitar NFCs <ArrowRight className="h-4 w-4" /></Link>
                <Link href="#plataforma" className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d2d2d7] bg-white px-5 text-sm font-semibold transition hover:bg-[#f5f5f7]">Ver la plataforma</Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6e6e73]">
                {["Sin aplicaciones", "Configuración incluida", "Datos verificados"].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#22c55e]" />{item}</span>)}
              </div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="border-b border-[#e8e8ed] bg-[#fafafa] px-4 py-5 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e8e8ed] bg-[#e8e8ed] lg:grid-cols-4">
            {valueProps.map(({ icon: Icon, value, label }) => <div key={label} className="flex items-center gap-3 bg-white p-4 sm:p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f0fdf4] text-[#15803d]"><Icon className="h-4 w-4" /></span><div><p className="text-lg font-semibold tracking-tight">{value}</p><p className="text-xs text-[#6e6e73]">{label}</p></div></div>)}
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl"><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#15803d]">Cómo funciona</p><h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Del toque al feedback en segundos.</h2><p className="mt-3 text-[#6e6e73]">Una experiencia simple para el cliente y datos útiles para tu negocio.</p></div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, desc }, index) => <article key={title} className="rounded-2xl border border-[#e8e8ed] bg-white p-6 transition hover:border-[#d2d2d7] hover:shadow-[0_16px_35px_-25px_rgba(29,29,31,.35)]"><div className="mb-8 flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0fdf4] text-[#15803d]"><Icon className="h-5 w-5" /></span><span className="text-xs font-semibold text-[#c7c7cc]">0{index + 1}</span></div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6e6e73]">{desc}</p></article>)}
            </div>
          </div>
        </section>

        <section id="nfc" className="scroll-mt-20 border-y border-[#e8e8ed] bg-[#f5f5f7] px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center"><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#15803d]">Dos experiencias</p><h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Un NFC para cada objetivo.</h2><p className="mt-3 text-[#6e6e73]">Reseñas públicas para crecer y feedback privado para mejorar.</p></div>
            <NfcSimulators />
          </div>
        </section>

        <section id="beneficios" className="scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
            {[{ eyebrow: "Para el dueño", title: "Decisiones claras, no suposiciones.", items: ownerBenefits, icon: BarChart3 }, { eyebrow: "Para el equipo", title: "Feedback que reconoce y ayuda.", items: teamBenefits, icon: Users }].map(({ eyebrow, title, items, icon: Icon }) => <article key={eyebrow} className="rounded-2xl border border-[#e8e8ed] p-6 sm:p-8"><span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-[#f0fdf4] text-[#15803d]"><Icon className="h-5 w-5" /></span><p className="text-xs font-semibold uppercase tracking-[.1em] text-[#15803d]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">{title}</h2><ul className="mt-6 space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-[#6e6e73]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" />{item}</li>)}</ul></article>)}
          </div>
        </section>

        <section id="plataforma" className="scroll-mt-20 border-y border-[#e8e8ed] bg-[#fafafa] px-4 py-4 sm:px-6 md:py-8"><div className="mx-auto max-w-6xl"><PlatformPreviews /></div></section>

        <section id="precios" className="scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl"><div className="mx-auto mb-10 max-w-2xl text-center"><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#15803d]">Precios</p><h2 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">Empieza con un tag. Crece con tu equipo.</h2><p className="mt-3 text-[#6e6e73]">Compra el NFC público una sola vez o elige un plan con panel y NFC por empleado.</p></div><PricingSection /></div>
        </section>

        <section id="faq" className="scroll-mt-20 border-y border-[#e8e8ed] bg-[#f5f5f7] px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#15803d]">Preguntas frecuentes</p><h2 className="text-3xl font-semibold tracking-[-.035em]">Todo claro antes del primer toque.</h2></div><div className="space-y-2">{faqs.map(([q, a]) => <details key={q} className="group rounded-xl border border-[#e8e8ed] bg-white px-5 py-4"><summary className="cursor-pointer list-none text-sm font-semibold [&::-webkit-details-marker]:hidden">{q}<span className="float-right text-lg font-normal text-[#6e6e73] transition group-open:rotate-45">+</span></summary><p className="mt-3 pr-6 text-sm leading-6 text-[#6e6e73]">{a}</p></details>)}</div></div>
        </section>

        <section className="px-4 py-16 sm:px-6 md:py-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[24px] bg-[#1d1d1f] px-6 py-12 text-center text-white sm:px-10 md:py-16"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#22c55e]/20 blur-3xl" /><p className="relative text-xs font-semibold uppercase tracking-[.12em] text-[#86efac]">Empieza hoy</p><h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">Tu próximo buen servicio empieza con un toque.</h2><p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 text-[#a1a1aa]">Facilita las reseñas, escucha a tus clientes y reconoce el trabajo de tu equipo.</p><Link href="/business-requests" className="relative mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#22c55e] px-5 text-sm font-semibold text-white transition hover:bg-[#16a34a]">Solicitar NFCs <ArrowRight className="h-4 w-4" /></Link></div>
        </section>
      </main>
    </div>
  );
}
