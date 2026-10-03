"use client";

import { useEffect, useState } from "react";
import { Building2, Check, CheckCircle2, LoaderCircle, MousePointerClick, Send, Star, UserRound, Wifi } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type NfcType = "A" | "B";
type Phase = "idle" | "approaching" | "detected" | "opening" | "destination";

const TYPE_INFO: Record<
  NfcType,
  { name: string; icon: typeof Building2; destination: string; objective: string; footer: string }
> = {
  A: {
    name: "Toque Público",
    icon: Building2,
    destination: "Google Reviews",
    objective: "Facilitar el acceso a las reseñas públicas",
    footer: "El tap redirige directo a la ficha de Google Reviews del negocio — reputación pública. Solo contamos cada lectura.",
  },
  B: {
    name: "Toque Personal",
    icon: UserRound,
    destination: "Plataforma Toque",
    objective: "Feedback, evolución y ranking interno",
    footer: "El tap abre nuestro formulario interno con el empleado ya identificado — alimenta el ranking del equipo y nunca sale de la plataforma.",
  },
};

function GoogleMark() {
  return <span className="text-lg font-bold"><span className="text-[#4285f4]">G</span></span>;
}

function PhoneFrame({ children, pulse = false, expanded = false }: { children: React.ReactNode; pulse?: boolean; expanded?: boolean }) {
  return (
    <div className={`relative rounded-[2rem] border-[5px] border-[#202124] bg-white p-1.5 shadow-2xl transition-all duration-500 ${expanded ? "h-[500px] w-[250px]" : "h-[350px] w-[190px]"} ${pulse ? "scale-105 shadow-[0_0_35px_rgba(34,197,94,0.35)]" : ""}`}>
      <div className="absolute left-1/2 top-1.5 z-20 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#202124]" />
      <div className="h-full overflow-hidden rounded-[1.45rem] bg-white pt-4">{children}</div>
    </div>
  );
}

function GoogleReviewScreen() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="flex h-full flex-col bg-white px-3 pb-3 pt-2 text-[#202124]">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
        <GoogleMark />
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4285f4] text-sm font-semibold text-white">PN</span>
      </div>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <CheckCircle2 className="mb-3 h-10 w-10 text-[#34a853]" />
          <p className="text-sm font-semibold">¡Gracias por tu reseña!</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Tu opinión ya está visible en Google.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-gray-500">Publicar públicamente</p>
          <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700">CL</div>
          <h4 className="mt-2 text-center text-sm font-semibold">Café Luz</h4>
          <p className="mt-1 text-center text-sm text-gray-500">Comparte tu experiencia</p>
          <div className="my-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} estrellas`}>
                <Star className={`h-5 w-5 transition hover:scale-110 ${value <= rating ? "fill-[#fbbc05] text-[#fbbc05]" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <textarea className="h-20 resize-none rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#4285f4]" placeholder="Comparte detalles de tu experiencia…" />
          <button type="button" disabled={!rating} onClick={() => setSent(true)} className="mt-auto rounded-full bg-[#1a73e8] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Publicar</button>
        </>
      )}
    </div>
  );
}

function EmployeeReviewScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex h-full flex-col bg-[#f8faf8] px-3 pb-3 pt-2 text-[#202124]">
      <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
        <Logo size={11} />
      </div>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100"><Check className="h-6 w-6 text-green-600" /></span>
          <p className="text-sm font-semibold">Feedback enviado</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Tu valoración privada ayudará a mejorar la atención.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-green-700">Atención de</p>
          <div className="mx-auto mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">MG</div>
          <h4 className="mt-2 text-center text-sm font-semibold">María González</h4>
          <p className="text-center text-sm text-gray-500">Café Luz · Mesera</p>
          <p className="mt-4 text-sm font-medium">¿Cómo fue tu atención?</p>
          <div className="mt-2 flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${value === rating ? "border-green-500 bg-green-500 text-white" : "border-gray-200 bg-white"}`}>{value}</button>
            ))}
          </div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-3 h-20 resize-none rounded-lg border border-gray-200 bg-white p-2 text-sm outline-none focus:border-green-500" placeholder="Cuéntanos sobre tu experiencia…" />
          <button type="button" disabled={!rating || !comment.trim()} onClick={() => setSent(true)} className="mt-auto flex items-center justify-center gap-1 rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"><Send className="h-4 w-4" /> Enviar feedback</button>
        </>
      )}
    </div>
  );
}

export function NfcSimulators() {
  const [type, setType] = useState<NfcType>("A");
  const [phase, setPhase] = useState<Phase>("idle");
  const info = TYPE_INFO[type];
  const isBusiness = type === "A";

  function selectType(next: NfcType) {
    setType(next);
    setPhase("idle");
  }

  function handleTap() {
    if (phase === "idle") setPhase("approaching");
    else if (phase === "destination") setPhase("idle");
  }

  useEffect(() => {
    if (phase === "idle" || phase === "destination") return;
    const durations = { approaching: 1100, detected: 900, opening: 1000 } as const;
    const next = { approaching: "detected", detected: "opening", opening: "destination" } as const;
    const timer = window.setTimeout(() => {
      if (phase === "detected" && navigator.vibrate) navigator.vibrate(80);
      setPhase(next[phase]);
    }, durations[phase]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
      {/* Selector */}
      <div className="grid grid-cols-2 border-b border-[var(--border)]">
        {(["A", "B"] as const).map((t) => {
          const active = t === type;
          const Icon = TYPE_INFO[t].icon;
          return (
            <button
              key={t}
              type="button"
              onClick={() => selectType(t)}
              className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              Tipo {t} · {TYPE_INFO[t].name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Info del tipo seleccionado */}
        <div className="flex flex-col justify-center">
          <dl className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--muted)]/40">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Destino</dt>
              <dd className="text-sm font-semibold text-[var(--foreground)]">{info.destination}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="shrink-0 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Objetivo</dt>
              <dd className="text-right text-sm text-[var(--foreground)]">{info.objective}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">{info.footer}</p>
        </div>

        {/* Demo interactivo */}
        <div
          className="relative min-h-[560px] cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_50%_25%,#ffffff_0%,#f2f3f1_55%,#e6e8e4_100%)]"
          onClick={handleTap}
          role="button"
          aria-label={phase === "idle" ? "Toca para probar la animación NFC" : phase === "destination" ? "Toca para reiniciar" : "Demo NFC en curso"}
        >
          {phase !== "destination" && (
            <>
              <div className="absolute left-1/2 top-8 -translate-x-1/2">
                <div className="relative flex h-24 w-40 items-center justify-center rounded-2xl border border-gray-300 bg-white shadow-xl">
                  <div className="absolute -top-2 h-4 w-20 rounded-full bg-green-500/20 blur-md" />
                  <Logo markOnly size={22} />
                  <span className="absolute bottom-2 text-sm font-semibold tracking-wider text-gray-500">NFC TIPO {type}</span>
                  {(phase === "approaching" || phase === "detected") && [0, 1, 2].map((ring) => <span key={ring} className="absolute h-16 w-16 animate-ping rounded-full border border-green-500/50" style={{ animationDelay: `${ring * 180}ms`, animationDuration: "1.4s" }} />)}
                </div>
              </div>
              <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 transition-all ease-in-out ${phase === "idle" ? "translate-y-8 rotate-[-8deg]" : phase === "approaching" ? "-translate-y-24 rotate-[5deg] duration-1000" : "-translate-y-28 rotate-[2deg] duration-200"}`}>
                <PhoneFrame pulse={phase === "detected"}>
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center">
                    {phase === "detected" ? (
                      <><CheckCircle2 className="mb-3 h-10 w-10 text-green-500" /><p className="text-sm font-semibold">NFC detectado</p><p className="mt-1 text-sm text-gray-500">Toque {type === "A" ? "Público" : "Personal"}</p></>
                    ) : phase === "opening" ? (
                      <><LoaderCircle className="mb-3 h-9 w-9 animate-spin text-green-600" /><p className="text-sm font-semibold">Abriendo enlace…</p></>
                    ) : (
                      <><Wifi className="mb-3 h-9 w-9 rotate-90 text-gray-400" /><p className="text-sm font-semibold">Listo para detectar</p></>
                    )}
                  </div>
                </PhoneFrame>
              </div>
              {phase === "idle" && (
                <div className="absolute inset-x-0 top-40 flex flex-col items-center gap-2 text-gray-500">
                  <MousePointerClick className="h-6 w-6 animate-bounce" />
                  <p className="text-sm font-semibold">Toca la pantalla para probar el tap</p>
                </div>
              )}
              <p className="absolute bottom-2 left-0 right-0 text-center text-sm font-medium text-gray-500">
                {phase === "approaching" ? "Acercando al chip NFC…" : phase === "detected" ? "Vibración y confirmación instantánea" : phase === "opening" ? "Redirigiendo al destino seguro…" : ""}
              </p>
            </>
          )}
          {phase === "destination" && (
            <div className="absolute inset-0 flex animate-[fade-in_400ms_ease-out] items-center justify-center p-2">
              <PhoneFrame expanded>{isBusiness ? <GoogleReviewScreen /> : <EmployeeReviewScreen />}</PhoneFrame>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
