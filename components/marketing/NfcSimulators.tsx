"use client";

import { useEffect, useState } from "react";
import { Building2, Check, CheckCircle2, LoaderCircle, RotateCcw, Send, SmartphoneNfc, Star, UserRound, Wifi } from "lucide-react";

interface SimulatorProps {
  type: "A" | "B";
}

type Phase = "idle" | "approaching" | "detected" | "opening" | "destination";

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
        <span className="h-5 w-5 rounded-full bg-[#4285f4] text-center text-[9px] font-semibold leading-5 text-white">PN</span>
      </div>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <CheckCircle2 className="mb-3 h-10 w-10 text-[#34a853]" />
          <p className="text-sm font-semibold">¡Gracias por tu reseña!</p>
          <p className="mt-2 text-[10px] leading-relaxed text-gray-500">Tu opinión ya está visible en Google.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-[10px] text-gray-500">Publicar públicamente</p>
          <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700">CL</div>
          <h4 className="mt-2 text-center text-sm font-semibold">Café Luz</h4>
          <p className="mt-1 text-center text-[10px] text-gray-500">Comparte tu experiencia</p>
          <div className="my-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} estrellas`}>
                <Star className={`h-5 w-5 transition hover:scale-110 ${value <= rating ? "fill-[#fbbc05] text-[#fbbc05]" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <textarea className="h-20 resize-none rounded-lg border border-gray-200 p-2 text-[10px] outline-none focus:border-[#4285f4]" placeholder="Comparte detalles de tu experiencia…" />
          <button type="button" disabled={!rating} onClick={() => setSent(true)} className="mt-auto rounded-full bg-[#1a73e8] px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-40">Publicar</button>
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
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-500 text-[10px] font-bold text-white">T</span>
        <span className="text-xs font-semibold">Toque</span>
      </div>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100"><Check className="h-6 w-6 text-green-600" /></span>
          <p className="text-sm font-semibold">Feedback enviado</p>
          <p className="mt-2 text-[10px] leading-relaxed text-gray-500">Tu valoración privada ayudará a mejorar la atención.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-[9px] font-medium uppercase tracking-wider text-green-700">Atención de</p>
          <div className="mx-auto mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">MG</div>
          <h4 className="mt-2 text-center text-sm font-semibold">María González</h4>
          <p className="text-center text-[10px] text-gray-500">Café Luz · Mesera</p>
          <p className="mt-4 text-[10px] font-medium">¿Cómo fue tu atención?</p>
          <div className="mt-2 flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] font-semibold transition ${value === rating ? "border-green-500 bg-green-500 text-white" : "border-gray-200 bg-white"}`}>{value}</button>
            ))}
          </div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-3 h-16 resize-none rounded-lg border border-gray-200 bg-white p-2 text-[10px] outline-none focus:border-green-500" placeholder="Cuéntanos sobre tu experiencia…" />
          <button type="button" disabled={!rating || !comment.trim()} onClick={() => setSent(true)} className="mt-auto flex items-center justify-center gap-1 rounded-full bg-green-600 px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-40"><Send className="h-3 w-3" /> Enviar feedback</button>
        </>
      )}
    </div>
  );
}

function Simulator({ type }: SimulatorProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const isBusiness = type === "A";

  useEffect(() => {
    if (phase === "approaching") {
      const timer = window.setTimeout(() => setPhase("detected"), 1100);
      return () => window.clearTimeout(timer);
    }
    if (phase === "detected") {
      if (navigator.vibrate) navigator.vibrate(80);
      const timer = window.setTimeout(() => setPhase("opening"), 900);
      return () => window.clearTimeout(timer);
    }
    if (phase === "opening") {
      const timer = window.setTimeout(() => setPhase("destination"), 1000);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  const start = () => setPhase("approaching");
  const reset = () => setPhase("idle");
  const running = phase !== "idle" && phase !== "destination";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary-dark)]">{isBusiness ? <Building2 className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}</div>
          <div><span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-dark)]">Tipo {type}</span><h3 className="font-semibold text-[var(--foreground)]">{isBusiness ? "Reseña de empresa" : "Reseña de empleado"}</h3></div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium transition ${running ? "bg-amber-100 text-amber-700" : phase === "destination" ? "bg-green-100 text-green-700" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>{running ? "Simulando…" : phase === "destination" ? "NFC abierto" : "Demo"}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-5 text-sm leading-relaxed text-[var(--muted-foreground)]">{isBusiness ? "El NFC abre directamente la reseña pública de Google del negocio." : "El NFC identifica al empleado y abre su formulario privado de valoración."}</p>
        <div className="relative mb-5 min-h-[560px] flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_50%_25%,#ffffff_0%,#f2f3f1_55%,#e6e8e4_100%)]">
          {phase !== "destination" && (
            <>
              <div className="absolute left-1/2 top-8 -translate-x-1/2">
                <div className="relative flex h-24 w-40 items-center justify-center rounded-2xl border border-gray-300 bg-white shadow-xl">
                  <div className="absolute -top-2 h-4 w-20 rounded-full bg-green-500/20 blur-md" />
                  <SmartphoneNfc className="h-9 w-9 text-green-600" />
                  <span className="absolute bottom-2 text-[9px] font-semibold tracking-wider text-gray-500">NFC TIPO {type}</span>
                  {(phase === "approaching" || phase === "detected") && [0, 1, 2].map((ring) => <span key={ring} className="absolute h-16 w-16 animate-ping rounded-full border border-green-500/50" style={{ animationDelay: `${ring * 180}ms`, animationDuration: "1.4s" }} />)}
                </div>
              </div>
              <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 transition-all ease-in-out ${phase === "idle" ? "translate-y-8 rotate-[-8deg]" : phase === "approaching" ? "-translate-y-24 rotate-[5deg] duration-1000" : "-translate-y-28 rotate-[2deg] duration-200"}`}>
                <PhoneFrame pulse={phase === "detected"}>
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center">
                    {phase === "detected" ? <><CheckCircle2 className="mb-3 h-10 w-10 text-green-500" /><p className="text-xs font-semibold">NFC detectado</p><p className="mt-1 text-[9px] text-gray-500">Toque · tipo {type}</p></> : phase === "opening" ? <><LoaderCircle className="mb-3 h-9 w-9 animate-spin text-green-600" /><p className="text-xs font-semibold">Abriendo enlace…</p></> : <><Wifi className="mb-3 h-9 w-9 rotate-90 text-gray-400" /><p className="text-xs font-semibold">Listo para detectar</p></>}
                  </div>
                </PhoneFrame>
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-medium text-gray-500">{phase === "idle" ? "" : phase === "approaching" ? "Acercando al chip NFC…" : phase === "detected" ? "Vibración y confirmación instantánea" : "Redirigiendo al destino seguro…"}</p>
            </>
          )}
          {phase === "destination" && <div className="absolute inset-0 flex animate-[fade-in_400ms_ease-out] items-center justify-center p-2"><PhoneFrame expanded>{isBusiness ? <GoogleReviewScreen /> : <EmployeeReviewScreen />}</PhoneFrame></div>}
        </div>
        <button type="button" onClick={phase === "idle" ? start : reset} disabled={running} className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {phase === "idle" ? <SmartphoneNfc className="h-4 w-4" /> : phase === "destination" ? <RotateCcw className="h-4 w-4" /> : <LoaderCircle className="h-4 w-4 animate-spin" />}
          {phase === "idle" ? `Simular NFC tipo ${type}` : phase === "destination" ? "Reiniciar simulación" : "Simulación en curso…"}
        </button>
      </div>
    </article>
  );
}

export function NfcSimulators() {
  const [selectedType, setSelectedType] = useState<"A" | "B">("A");

  return (
    <section className="mb-20">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold text-[var(--primary-dark)]">Pruébalo tú mismo</p>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">Dos NFC, dos experiencias</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">Mira cómo el teléfono detecta el chip y prueba la experiencia completa del cliente.</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 grid grid-cols-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-1.5">
          <button
            type="button"
            onClick={() => setSelectedType("A")}
            aria-pressed={selectedType === "A"}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${selectedType === "A" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-sm)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            <Building2 className="h-4 w-4" />
            Reseña de empresa
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("B")}
            aria-pressed={selectedType === "B"}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${selectedType === "B" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-sm)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            <UserRound className="h-4 w-4" />
            Reseña de empleado
          </button>
        </div>
        <Simulator key={selectedType} type={selectedType} />
      </div>
    </section>
  );
}
