"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export interface AdminField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
}

interface AdminEntityActionsProps {
  endpoint: string;
  fields: AdminField[];
  values: Record<string, string | number | boolean | null>;
  deleteConfirm?: string;
}

export function AdminEntityActions({ endpoint, fields, values, deleteConfirm }: AdminEntityActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openEditor() {
    const initial: Record<string, string | number | boolean> = {};
    for (const field of fields) {
      initial[field.name] = values[field.name] ?? (field.type === "checkbox" ? false : "");
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
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Error al guardar");
    }
  }

  async function remove() {
    if (!window.confirm(deleteConfirm ?? "¿Eliminar este registro? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Error al eliminar");
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openEditor}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--input)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50"
        >
          <Pencil className="h-3 w-3" /> Editar
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" /> Eliminar
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--foreground)]">Editar</h3>
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
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
