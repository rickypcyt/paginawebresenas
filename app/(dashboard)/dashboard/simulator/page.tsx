"use client";

import { useState } from "react";
import { SmartphoneNfc, CheckCircle2 } from "lucide-react";

export default function DashboardSimulatorPage() {
  const [simulated, setSimulated] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Simulador de tap</h1>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)]">
          <SmartphoneNfc className="h-10 w-10" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-[var(--foreground)]">
          Prueba la experiencia de un cliente
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-[var(--muted-foreground)]">
          Toca el botón para simular que un cliente acerca su teléfono a un NFC. Verás qué destino se abre según el tipo de tag.
        </p>

        {simulated ? (
          <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <div className="flex items-center justify-center gap-2 text-[var(--primary-dark)]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Tap detectado</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              En producción esto abriría la ficha de Google o el formulario de reseña interna del empleado.
            </p>
            <button
              onClick={() => setSimulated(false)}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Simular otro tap
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSimulated(true)}
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--primary-dark)]"
          >
            Simular tap
          </button>
        )}
      </div>
    </div>
  );
}
