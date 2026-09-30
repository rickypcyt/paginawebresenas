"use client";

import { useState } from "react";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface ScheduleEntry {
  days: string[];
  open: string;
  close: string;
}

interface BusinessHoursInputProps {
  value: string;
  onChange: (value: string) => void;
}

function parseSchedule(value: string): ScheduleEntry[] {
  if (!value) return [{ days: ["Lun", "Mar", "Mié", "Jue", "Vie"], open: "08:00", close: "20:00" }];
  return value.split("; ").map((part) => {
    const match = part.match(/^([\wáéíóúÁÉÍÓÚ\-,\s]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/i);
    if (!match) return { days: [], open: "", close: "" };
    // "Lun-Vie" es un rango (expande); "Lun,Mié" son días sueltos.
    const days = match[1]
      .split(",")
      .flatMap((segment) => {
        const trimmed = segment.trim();
        const range = trimmed.match(/^(\w+)\s*-\s*(\w+)$/u);
        if (!range) return [trimmed];
        const from = DAYS.indexOf(range[1]);
        const to = DAYS.indexOf(range[2]);
        return from !== -1 && to !== -1 && to >= from
          ? DAYS.slice(from, to + 1)
          : [range[1], range[2]];
      })
      .filter(Boolean);
    return { days, open: match[2], close: match[3] };
  });
}

function formatDays(days: string[]): string {
  // Agrupa solo tramos contiguos como "Lun-Vie"; el resto va con comas.
  const sorted = [...days].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
  const parts: string[] = [];
  let runStart = 0;
  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || DAYS.indexOf(sorted[i]) !== DAYS.indexOf(sorted[i - 1]) + 1) {
      parts.push(
        i - runStart > 2
          ? `${sorted[runStart]}-${sorted[i - 1]}`
          : sorted.slice(runStart, i).join(",")
      );
      runStart = i;
    }
  }
  return parts.join(",");
}

function formatSchedule(entries: ScheduleEntry[]): string {
  return entries
    .filter((e) => e.days.length > 0 && e.open && e.close)
    .map((e) => `${formatDays(e.days)} ${e.open}-${e.close}`)
    .join("; ");
}

function toggleDay(entry: ScheduleEntry, day: string): string[] {
  return entry.days.includes(day)
    ? entry.days.filter((d) => d !== day)
    : [...entry.days, day].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
}

export function BusinessHoursInput({ value, onChange }: BusinessHoursInputProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(() => parseSchedule(value));

  // Notifica solo en cambios del usuario (no al montar, para no pisar el estado del padre).
  function commit(next: ScheduleEntry[]) {
    setEntries(next);
    onChange(formatSchedule(next));
  }

  function addEntry() {
    commit([...entries, { days: ["Sáb", "Dom"], open: "09:00", close: "14:00" }]);
  }

  function removeEntry(index: number) {
    commit(entries.filter((_, i) => i !== index));
  }

  function updateEntry(index: number, updates: Partial<ScheduleEntry>) {
    commit(entries.map((e, i) => (i === index ? { ...e, ...updates } : e)));
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-[var(--input)] bg-white p-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => updateEntry(index, { days: toggleDay(entry, day) })}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  entry.days.includes(day)
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={entry.open}
              onChange={(e) => updateEntry(index, { open: e.target.value })}
              className="rounded-md border border-[var(--input)] px-2 py-1 text-sm"
            />
            <span className="text-[var(--muted-foreground)]">-</span>
            <input
              type="time"
              value={entry.close}
              onChange={(e) => updateEntry(index, { close: e.target.value })}
              className="rounded-md border border-[var(--input)] px-2 py-2 text-sm"
            />
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="ml-auto text-sm text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="text-sm font-medium text-[var(--primary)] hover:underline"
      >
        + Añadir horario
      </button>
      <p className="text-xs text-[var(--muted-foreground)]">
        Resultado: {formatSchedule(entries) || "Sin horario"}
      </p>
    </div>
  );
}
