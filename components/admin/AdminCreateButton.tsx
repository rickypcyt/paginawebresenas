"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { AdminField } from "./AdminEntityActions";

interface AdminCreateButtonProps {
  endpoint: string;
  fields: AdminField[];
  label: string;
  title?: string;
}

export function AdminCreateButton({ endpoint, fields, label, title }: AdminCreateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreator() {
    const initial: Record<string, string | number | boolean> = {};
    for (const field of fields) {
      initial[field.name] = field.type === "checkbox" ? false : "";
    }
    setForm(initial);
    setError(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Error al crear");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openCreator}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary-dark)]"
      >
        <Plus className="h-3.5 w-3.5" /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--foreground)]">{title ?? label}</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {fields.map((field) => (
              <div key={field.name}>
                {field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
                      className="h-4 w-4"
                    />
                    {field.label}
                  </label>
                ) : (
                  <>
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={String(form[field.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={String(form[field.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={String(form[field.name] ?? "")}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
