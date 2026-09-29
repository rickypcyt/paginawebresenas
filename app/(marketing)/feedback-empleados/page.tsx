import Link from "next/link";
import type { Metadata } from "next";
import { BarChart3, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback de empleados: mide la atención de tu equipo",
  description:
    "Sistema de feedback para empleados: valoraciones privadas por cliente, promedios, ranking del equipo y panel de gestión para mejorar la atención.",
  alternates: { canonical: "/feedback-empleados" },
  openGraph: {
    title: "Feedback de empleados con NFC | Toque",
    description: "Valoraciones privadas, ranking del equipo y panel de gestión.",
    type: "article",
  },
};

const sections = [
  {
    icon: MessageSquare,
    title: "Feedback privado, no público",
    text: "Cada empleado tiene su propio tag NFC. El cliente valora la atención recibida en un formulario interno: la valoración llega solo al panel del negocio y al propio empleado, sin exponer a nadie públicamente en Google.",
  },
  {
    icon: BarChart3,
    title: "Métricas que sí se pueden actuar",
    text: "Promedio por empleado, porcentaje de experiencias positivas, tendencia mes a mes y volumen de valoraciones. Datos suficientes para detectar quién destaca, quién necesita apoyo y si la atención mejora.",
  },
  {
    icon: TrendingUp,
    title: "Ranking del equipo",
    text: "El panel muestra la posición de cada colaborador por valoraciones del periodo. El reconocimiento visible del mejor servicio funciona mejor que las revisiones anuales para motivar al equipo.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidad por diseño",
    text: "Cada empleado solo ve sus propias valoraciones; el acceso al conjunto de datos es del administrador del negocio. Si un empleado se va, su NFC se desactiva y sus valoraciones históricas se conservan.",
  },
];

export default function FeedbackEmpleadosPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 md:py-24">
      <article className="mx-auto w-full max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary-dark)]">Gestión del equipo</p>
        <h1 className="mb-6 text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-5xl">
          Feedback de empleados: mide la atención de tu equipo
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-[var(--muted-foreground)]">
          Sabes cuántas reseñas tiene tu negocio en Google — pero ¿sabes quién de tu equipo atiende mejor? Con Toque Personal cada empleado tiene su propio NFC y cada cliente puede valorar su atención en segundos.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-3 flex items-center gap-3">
                <section.icon className="h-6 w-6 text-[var(--primary-dark)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{section.title}</h2>
              </div>
              <p className="leading-relaxed text-[var(--muted-foreground)]">{section.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="mb-3 text-xl font-semibold text-[var(--foreground)]">Lo que ve cada perfil</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="mb-1 font-semibold text-[var(--foreground)]">El dueño</p>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Ranking del equipo, promedios, evolución y todas las valoraciones del periodo.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-4">
              <p className="mb-1 font-semibold text-[var(--foreground)]">El empleado</p>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Su propia valoración, % de experiencias positivas y posición en el equipo — solo lo suyo.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href="/business-requests"
            className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Solicitar NFCs para mi equipo
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--primary-dark)] hover:underline">
            Ver cómo funciona Toque →
          </Link>
        </div>
      </article>
    </main>
  );
}
