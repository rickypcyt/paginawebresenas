import Link from "next/link";
import { ArrowRight, Check, MessageSquare, Package, Smartphone, Star, Store } from "lucide-react";
import { RegisterBusinessButton } from "@/components/auth/RegisterBusinessButton";

const steps = [
  {
    icon: Package,
    title: "Recibes tus NFCs",
    desc: "Te entregamos un NFC para Google y los NFC personalizados para tu equipo.",
  },
  {
    icon: Smartphone,
    title: "El cliente acerca el móvil",
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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[var(--primary-light)] via-white to-[#d1fae5] px-4 py-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-white/90 p-6 pb-4 shadow-[var(--shadow-lg)] backdrop-blur md:p-10 md:pb-5">


        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] md:text-5xl">
          Convierte cada atención en una reseña.
        </h1>

        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          Vendemos NFCs para negocios: uno lleva al cliente directamente a tus reseñas de Google; otro le permite valorar a la persona que le atendió.
        </p>

        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-5">
          <h2 className="mb-4 text-lg font-bold text-[var(--foreground)]">¿Cómo funciona?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl bg-[var(--primary-light)] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--primary)]">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">NFC Google Reviews</h2>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Colócalo en caja, entrada o mesa. El cliente acerca el móvil y abre la página de reseñas de Google de tu negocio.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl bg-[var(--muted)] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--primary)]">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">NFC del equipo</h2>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                Un NFC por empleado. El cliente deja feedback sobre la atención recibida, identificada y medible.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {benefits.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-[var(--foreground)] md:text-base">
              <Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />
              {item}
            </div>
          ))}
        </div>


      </div>
    </main>
  );
}
