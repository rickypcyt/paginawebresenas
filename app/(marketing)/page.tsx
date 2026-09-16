import Link from "next/link";
import { Check, MessageSquare, Package, Smartphone, Store, Star } from "lucide-react";

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

const products = [
  {
    icon: Store,
    title: "NFC Google Reviews",
    desc: "Colócalo en caja, entrada o mesa. El cliente acerca el móvil y abre la página de reseñas de Google de tu negocio.",
  },
  {
    icon: Star,
    title: "NFC del equipo",
    desc: "Un NFC por empleado. El cliente deja feedback sobre la atención recibida, identificada y medible.",
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
      <div className="mx-auto w-full max-w-4xl">
        <section className="mb-20 text-center">
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-6xl">
            Convierte cada atención en una reseña.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
            NFCs para negocios: uno lleva a tus clientes a las reseñas de Google; otro les permite valorar a quien les atendió.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </section>

        <section className="mb-20 rounded-3xl bg-[var(--secondary)] p-8 md:p-12">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
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

        <section className="mb-20 grid gap-6 md:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.title}
                className="flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{product.title}</h2>
                <p className="leading-relaxed text-[var(--muted-foreground)]">{product.desc}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-3xl border border-[var(--border)] p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
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
      </div>
    </main>
  );
}
