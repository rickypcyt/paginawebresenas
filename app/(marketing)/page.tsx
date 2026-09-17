import Link from "next/link";
import { Check, MessageSquare, Package, Smartphone } from "lucide-react";
import { ReviewCard3D } from "@/components/marketing/ReviewCard3D";
import { NfcSimulators } from "@/components/marketing/NfcSimulators";
import { PlatformPreviews } from "@/components/marketing/PlatformPreviews";

const steps = [
  {
    icon: Package,
    title: "Recibes tus NFCs",
    desc: "Te entregamos un NFC para Google y los NFC personalizados para tu equipo.",
  },
  {
    icon: Smartphone,
    title: "El cliente acerca el teléfono",
    desc: "Cada NFC abre automáticamente el destino correcto, sin cámara ni búsquedas.",
  },
  {
    icon: MessageSquare,
    title: "Recibes feedback",
    desc: "El cliente reseña tu negocio en Google o valora directamente a quien le atendió.",
  },
];

const benefits = [
  "Aumenta tus reseñas de Google",
  "Separa la opinión del negocio y la atención del empleado",
  "Gestiona tus NFCs desde un único panel",
  "Detecta qué experiencias generan fidelidad",
];

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)] px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-20 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-medium tracking-tight text-[var(--foreground)] md:text-6xl">
              Deja tu reseña en un <span className="italic">Toque.</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
              NFCs para negocios: uno lleva a tus clientes a las reseñas de Google; otro les permite valorar a quien les atendió.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/business-requests"
                className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
              >
                Solicitar NFCs para mi negocio
              </Link>
              <Link
                href="/"
                className="rounded-full px-7 py-3 text-sm font-medium text-[var(--primary)] transition hover:bg-[var(--primary-light)]"
              >
                Acceder a la app
              </Link>
            </div>
          </div>
          <ReviewCard3D />
        </section>

        <NfcSimulators />

        <section className="mb-20 rounded-3xl bg-[var(--secondary)] p-8 md:p-12">
          <h2 className="mb-10 text-center text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
            ¿Cómo funciona?
          </h2>
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

        <section className="rounded-3xl border border-[var(--border)] p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-medium tracking-tight text-[var(--foreground)] md:text-3xl">
            Todo lo que necesitas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div key={item} className="flex items-center gap-3 text-[var(--foreground)]">
                <Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <PlatformPreviews />
      </div>
    </main>
  );
}
