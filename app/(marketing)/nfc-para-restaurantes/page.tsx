import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Clock, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "NFC para restaurantes y cafeterías: más reseñas en cada mesa",
  description:
    "Tags NFC para restaurantes: dónde colocarlos, cómo funcionan durante el servicio y cómo conseguir más reseñas de Google y feedback de tu equipo de sala.",
  alternates: { canonical: "/nfc-para-restaurantes" },
  openGraph: {
    title: "NFC para restaurantes y cafeterías | Toque",
    description: "Más reseñas de Google y mejor atención en cada servicio.",
    type: "article",
  },
};

const sections = [
  {
    icon: MapPin,
    title: "Dónde colocar los tags NFC",
    items: [
      "En la barra o caja: el cliente lo ve justo al pagar, cuando la experiencia acaba de terminar.",
      "En el expositor de la carta o junto al ticket: el camarero lo señala al entregar la cuenta.",
      "En la entrada o zona de espera: los clientes que esperan mesa interactúan mientras tanto.",
    ],
  },
  {
    icon: Clock,
    title: "Cómo funcionan durante el servicio",
    items: [
      "El cliente acerca su móvil al NFC del mostrador y Google se abre directo en tu ficha para reseñar.",
      "Cada mesero lleva su propio NFC: el cliente valora su atención de forma privada, sin exponerlo en Google.",
      "No hace falta app, registro ni pasos extra para el cliente: un toque y listo.",
    ],
  },
  {
    icon: Users,
    title: "Feedback del equipo de sala",
    items: [
      "Ves el promedio de valoración de cada mesero y su evolución mes a mes.",
      "El ranking interno motiva al equipo: el mejor servicio del mes queda visible.",
      "Detectas problemas de atención antes de que se conviertan en una reseña negativa en Google.",
    ],
  },
];

export default function NfcParaRestaurantesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 md:py-24">
      <article className="mx-auto w-full max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary-dark)]">Para restaurantes y cafeterías</p>
        <h1 className="mb-6 text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-5xl">
          NFC para restaurantes: más reseñas en cada servicio
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-[var(--muted-foreground)]">
          En un restaurante cada mesa es una oportunidad de reseña. Los tags NFC de Toque convierten ese momento en un gesto de un segundo: el cliente acerca el móvil y deja su reseña en Google, o valora en privado al mesero que le atendió.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-4 flex items-center gap-3">
                <section.icon className="h-6 w-6 text-[var(--primary-dark)]" />
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[var(--muted-foreground)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-3 flex items-center gap-3">
            <Star className="h-6 w-6 text-[var(--star)]" />
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Planes según el tamaño de tu sala</h2>
          </div>
          <p className="leading-relaxed text-[var(--muted-foreground)]">
            Los planes de Toque van de 1 a 50 empleados: cada mesero recibe su NFC personal y tú recibes el panel con reseñas internas, promedios y ranking del equipo. La instalación incluye los tags personalizados para tu restaurante.
          </p>
          <Link href="/#precios" className="mt-4 inline-block text-sm font-medium text-[var(--primary-dark)] hover:underline">
            Ver planes y precios →
          </Link>
        </section>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href="/business-requests"
            className="rounded-full bg-[var(--foreground)] px-7 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Solicitar NFCs para mi restaurante
          </Link>
          <Link href="/" className="text-sm font-medium text-[var(--primary-dark)] hover:underline">
            Ver cómo funciona Toque →
          </Link>
        </div>
      </article>
    </main>
  );
}
