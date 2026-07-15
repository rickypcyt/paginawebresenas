export const dynamic = "force-dynamic";

export default function HowItWorksPage() {
  const steps = [
    { icon: "🔍", title: "Descubre", desc: "Encuentra negocios y lee reseñas reales de la comunidad." },
    { icon: "⭐", title: "Reseña", desc: "Comparte tu experiencia y ayuda a otros usuarios a decidir." },
    { icon: "🎁", title: "Ahorra", desc: "Reclama ofertas exclusivas y sigue tus negocios favoritos." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)]">¿Cómo funciona?</h1>
      <p className="mb-12 text-[var(--muted-foreground)]">
        Tres pasos para aprovechar la plataforma.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <p className="mb-3 text-4xl">{step.icon}</p>
            <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">{step.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
