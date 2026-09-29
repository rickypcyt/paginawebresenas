import Link from "next/link";
import type { Metadata } from "next";
import { Star, Smartphone, QrCode, BarChart3, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo conseguir más reseñas en Google para tu negocio",
  description:
    "Métodos legítimos para conseguir más reseñas de Google: facilita el acceso a tu ficha, pide reseñas en el momento adecuado y mide los resultados.",
  alternates: { canonical: "/como-conseguir-resenas-google" },
  openGraph: {
    title: "Cómo conseguir más reseñas en Google | Toque",
    description: "Guía práctica para aumentar las reseñas de tu negocio de forma legítima.",
    type: "article",
  },
};

const methods = [
  {
    icon: QrCode,
    title: "Facilita el acceso a tu ficha de Google",
    text: "La mayoría de clientes no deja reseña porque buscar tu negocio en Google da pereza. Un código QR o un tag NFC en el mostrador elimina esa fricción: el cliente toca y llega directo a tu ficha.",
  },
  {
    icon: Smartphone,
    title: "Pide la reseña en el momento adecuado",
    text: "El mejor momento es justo después de una buena experiencia: al entregar el pedido, al terminar el servicio o al cobrar. Una frase simple del equipo sumada a un acceso directo multiplica los resultados.",
  },
  {
    icon: CheckCircle2,
    title: "Hazlo de forma neutral y legítima",
    text: "Google penaliza las reseñas compradas o condicionadas. Pide la reseña a todos los clientes por igual, sin ofrecer incentivos ni pedir solo valoraciones positivas.",
  },
  {
    icon: BarChart3,
    title: "Mide lo que funciona",
    text: "Cuenta cuántos clientes interactúan con tu punto de reseña y compáralo con las reseñas que recibes. Si hay muchos taps y pocas reseñas, el problema está en el pedido del equipo, no en el acceso.",
  },
];

export default function ComoConseguirResenasPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 md:py-24">
      <article className="mx-auto w-full max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary-dark)]">Guía para negocios</p>
        <h1 className="mb-6 text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-5xl">
          Cómo conseguir más reseñas en Google para tu negocio
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-[var(--muted-foreground)]">
          Las reseñas de Google son el primer filtro de tus clientes: afectan tu posición en el mapa, tu reputación y la decisión de visita. La buena noticia es que la mayoría de negocios no necesita más clientes felices — necesita que los que ya tienen les resulte fácil dejar la reseña.
        </p>

        <div className="space-y-8">
          {methods.map((method, i) => (
            <section key={method.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-3 flex items-center gap-3">
                <method.icon className="h-6 w-6 text-[var(--primary-dark)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {i + 1}. {method.title}
                </h2>
              </div>
              <p className="leading-relaxed text-[var(--muted-foreground)]">{method.text}</p>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-3 flex items-center gap-3">
            <Star className="h-6 w-6 text-[var(--star)]" />
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Cómo lo resuelve Toque</h2>
          </div>
          <p className="leading-relaxed text-[var(--muted-foreground)]">
            Toque te entrega un tag NFC físico que lleva al cliente directo a tu ficha de Google con un solo toque — sin apps, sin búsquedas, sin códigos difíciles de escanear. Además, un segundo NFC por empleado recoge valoraciones internas que solo ves tú, para mejorar la atención antes de que llegue a Google.
          </p>
        </section>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href="/business-requests"
            className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Solicitar NFCs para mi negocio
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--primary-dark)] hover:underline">
            Ver cómo funciona Toque →
          </Link>
        </div>
      </article>
    </main>
  );
}
