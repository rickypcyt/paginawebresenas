import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight, Check, Smartphone, Star, Store, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [businessCount, nfcCount, reviewCount] = await Promise.all([
    prisma.business.count({ where: { status: { in: ["community", "verified", "premium"] } } }),
    prisma.nfcTag.count({ where: { active: true } }),
    prisma.review.count(),
  ]);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-gradient-to-br from-[var(--primary-light)] to-[#d1fae5] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-white/70 px-3 py-1.5 text-sm font-semibold text-[var(--primary)]">
              <Smartphone className="h-4 w-4" />
              Reseñas activadas con NFC
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] md:text-6xl">
              Convierte cada atención en una reseña.
              <br />
              <span className="text-[var(--primary)]">Sin fricción. Sin QR.</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
              Vendemos NFCs para negocios: uno lleva al cliente directamente a las reseñas de Google y otro le permite valorar a la persona que le atendió. Toca, reseña y crece.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/business-requests" className="rounded-xl bg-[var(--primary)] px-8 py-3.5 text-center text-base font-bold text-white shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]">
                Quiero NFCs para mi negocio
              </Link>
              <Link href="/como-funciona" className="rounded-xl border border-[var(--primary)] bg-white px-8 py-3.5 text-center text-base font-semibold text-[var(--primary)] transition hover:bg-[var(--primary-light)]">
                Ver cómo funciona
              </Link>
            </div>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              ["NFCs activos", nfcCount],
              ["Negocios conectados", businessCount],
              ["Reseñas recibidas", reviewCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">Un producto, dos experiencias</p>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">El NFC correcto para cada momento.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]"><Store className="h-6 w-6" /></div>
              <h3 className="mb-3 text-xl font-bold text-[var(--foreground)]">NFC Google Reviews</h3>
              <p className="mb-5 leading-relaxed text-[var(--muted-foreground)]">Colócalo en la barra, caja o salida. El cliente acerca el móvil y llega a la página de reseñas de Google de tu negocio.</p>
              <ul className="space-y-2 text-sm text-[var(--foreground)]"><li className="flex gap-2"><Check className="h-5 w-5 text-[var(--primary)]" />Más reseñas en el momento de satisfacción</li><li className="flex gap-2"><Check className="h-5 w-5 text-[var(--primary)]" />Destino configurable por negocio</li></ul>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]"><Star className="h-6 w-6" /></div>
              <h3 className="mb-3 text-xl font-bold text-[var(--foreground)]">NFC para valorar al equipo</h3>
              <p className="mb-5 leading-relaxed text-[var(--muted-foreground)]">Entrega un NFC personalizado a cada persona del equipo. El cliente deja feedback sobre la atención recibida, no sobre una experiencia genérica.</p>
              <ul className="space-y-2 text-sm text-[var(--foreground)]"><li className="flex gap-2"><Check className="h-5 w-5 text-[var(--primary)]" />Feedback atribuido a cada empleado</li><li className="flex gap-2"><Check className="h-5 w-5 text-[var(--primary)]" />Reconoce y mejora el servicio</li></ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[var(--muted)] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">Así de fácil funciona</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[{ icon: "1", title: "Recibes tus NFCs", desc: "Te entregamos los NFCs configurados para tu negocio y para cada miembro del equipo." }, { icon: "2", title: "El cliente acerca el móvil", desc: "No abre la cámara ni busca enlaces. Un toque abre la experiencia correcta." }, { icon: "3", title: "Conviertes atención en feedback", desc: "Google recibe más reseñas y tu equipo recibe reconocimiento medible." }].map((step) => (
              <div key={step.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">{step.icon}</div><h3 className="mb-2 font-bold text-[var(--foreground)]">{step.title}</h3><p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{step.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div><div className="mb-5 flex items-center gap-3"><Users className="h-6 w-6 text-[var(--primary)]" /><h2 className="text-2xl font-bold text-[var(--foreground)]">Para negocios</h2></div><ul className="space-y-3 text-[var(--foreground)]">{["Aumenta tus reseñas de Google", "Separa la opinión del negocio y la atención del empleado", "Gestiona tus NFCs desde un único panel", "Detecta qué experiencias generan fidelidad"].map((item) => <li key={item} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />{item}</li>)}</ul></div>
          <div className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-8 text-white"><h2 className="mb-3 text-2xl font-bold">¿Listo para activar tus reseñas?</h2><p className="mb-6 text-white/80">Cuéntanos cuántos puntos de atención y empleados tiene tu negocio.</p><Link href="/business-requests" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[var(--primary)]">Solicitar NFCs <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </div>
  );
}
