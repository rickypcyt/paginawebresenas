import { BarChart3, Building2, MessageSquareText, MousePointerClick, Star, TrendingUp, UserRound, Users } from "lucide-react";

const team = [
  { name: "María González", role: "Mesera", rating: "4.9", reviews: 38, width: "96%" },
  { name: "Carlos Rivera", role: "Barista", rating: "4.7", reviews: 31, width: "88%" },
  { name: "Ana Torres", role: "Caja", rating: "4.5", reviews: 24, width: "78%" },
  { name: "Diego Mora", role: "Runner", rating: "4.2", reviews: 18, width: "62%" },
];

function BusinessPanelPreview() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary-dark)]"><Building2 className="h-5 w-5" /></span>
          <div><p className="text-sm text-[var(--muted-foreground)]">Panel del negocio</p><p className="text-lg font-semibold text-[var(--foreground)]">Café Luz</p></div>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Datos en vivo</span>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[var(--muted)] p-4"><MessageSquareText className="mb-2 h-5 w-5 text-[var(--primary-dark)]" /><p className="text-2xl font-bold text-[var(--foreground)]">127</p><p className="text-sm text-[var(--muted-foreground)]">Reseñas internas</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-4"><Star className="mb-2 h-5 w-5 fill-[var(--star)] text-[var(--star)]" /><p className="text-2xl font-bold text-[var(--foreground)]">4.8</p><p className="text-sm text-[var(--muted-foreground)]">Rating promedio</p></div>
          <div className="rounded-xl bg-[var(--muted)] p-4"><MousePointerClick className="mb-2 h-5 w-5 text-[var(--primary-dark)]" /><p className="text-2xl font-bold text-[var(--foreground)]">342</p><p className="text-sm text-[var(--muted-foreground)]">Taps NFC</p></div>
        </div>

        <div className="flex-1 rounded-2xl border border-[var(--border)] p-5">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-base font-semibold text-[var(--foreground)]">Ranking del equipo</p><p className="text-sm text-[var(--muted-foreground)]">Valoraciones de este mes</p></div><Users className="h-5 w-5 text-[var(--muted-foreground)]" /></div>
          <div className="space-y-4">
            {team.map((employee, index) => (
              <div key={employee.name} className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
                <span className="text-center text-sm font-bold text-[var(--primary-dark)]">#{index + 1}</span>
                <div><div className="flex justify-between gap-2"><span className="truncate text-sm font-semibold text-[var(--foreground)]">{employee.name}</span><span className="text-sm text-[var(--muted-foreground)]">{employee.reviews}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--muted)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: employee.width }} /></div></div>
                <span className="text-sm font-bold text-[var(--foreground)]">{employee.rating}★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmployeePanelPreview() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary-dark)]"><UserRound className="h-5 w-5" /></span>
          <div><p className="text-sm text-[var(--muted-foreground)]">Mi Toque</p><p className="text-lg font-semibold text-[var(--foreground)]">María González</p></div>
        </div>
        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-sm font-semibold text-[var(--primary-dark)]">Mesera</span>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div className="rounded-2xl border border-green-200 bg-[var(--primary-light)] p-6 text-[var(--foreground)]">
          <div className="flex items-start justify-between"><div><p className="text-base text-[var(--muted-foreground)]">Tu valoración</p><p className="mt-1 text-5xl font-bold">4.9<span className="text-2xl text-[var(--star)]">★</span></p></div><TrendingUp className="h-7 w-7 text-[var(--primary-dark)]" /></div>
          <div className="mt-5 flex items-center justify-between text-sm text-[var(--muted-foreground)]"><span>38 reseñas recibidas</span><span className="font-semibold text-[var(--primary-dark)]">+0.3 este mes</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] p-4"><BarChart3 className="mb-2 h-5 w-5 text-[var(--primary-dark)]" /><p className="text-2xl font-bold text-[var(--foreground)]">96%</p><p className="text-sm text-[var(--muted-foreground)]">Experiencias positivas</p></div>
          <div className="rounded-xl border border-[var(--border)] p-4"><Users className="mb-2 h-5 w-5 text-[var(--primary-dark)]" /><p className="text-2xl font-bold text-[var(--foreground)]">#1</p><p className="text-sm text-[var(--muted-foreground)]">Posición en el equipo</p></div>
        </div>

        <div className="flex-1 rounded-2xl border border-[var(--border)] p-5">
          <p className="text-base font-semibold text-[var(--foreground)]">Feedback reciente</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[var(--muted)] p-4"><div className="flex justify-between"><span className="text-sm font-semibold">Atención excelente</span><span className="text-sm text-[var(--star)]">5★</span></div><p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">“Muy amable y rápida con nuestro pedido.”</p></div>
            <div className="rounded-xl bg-[var(--muted)] p-4"><div className="flex justify-between"><span className="text-sm font-semibold">Gran experiencia</span><span className="text-sm text-[var(--star)]">5★</span></div><p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">“Nos explicó todo el menú con mucha paciencia.”</p></div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PlatformPreviews() {
  return (
    <section className="mt-20">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-2 text-sm font-semibold text-[var(--primary-dark)]">Incluido con Toque</p>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">Todo tu negocio. Una sola aplicación.</h2>
        <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">Nuestro servicio no termina en el NFC. El panel del negocio te permite conocer las reseñas, medir cada toque y comparar el rendimiento de tu equipo. Cada empleado también recibe una vista personal para entender sus valoraciones y mejorar su atención.</p>
      </div>
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <div className="flex flex-col"><BusinessPanelPreview /></div>
        <div className="flex flex-col"><EmployeePanelPreview /></div>
      </div>
    </section>
  );
}
