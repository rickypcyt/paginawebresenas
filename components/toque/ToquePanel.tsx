"use client";

import { useEffect, useRef, createElement } from "react";

export type ToqueTag = "toque-admin" | "toque-dueno" | "toque-empleado";

interface ToquePanelProps {
  tag: ToqueTag;
  data?: unknown;
  hooks?: Record<string, (...args: unknown[]) => unknown>;
  onLogout?: () => void;
  theme?: "light" | "dark";
  hideHeader?: boolean;
}

const SRC: Record<ToqueTag, string> = {
  "toque-admin": "/toque/toque-admin.js",
  "toque-dueno": "/toque/toque-dueno.js",
  "toque-empleado": "/toque/toque-empleado.js",
};

function loadComponent(tag: ToqueTag, src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (customElements.get(tag)) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[data-toque="${tag}"]`);
    if (existing) {
      customElements.whenDefined(tag).then(() => resolve()).catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    script.dataset.toque = tag;
    script.onload = () => {
      customElements.whenDefined(tag).then(() => resolve()).catch(reject);
    };
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(script);
  });
}

export default function ToquePanel({
  tag,
  data,
  hooks,
  onLogout,
  theme = "dark",
  hideHeader,
}: ToquePanelProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    const el = ref.current;
    if (!el) return;

    loadComponent(tag, SRC[tag])
      .then(() => {
        if (!alive) return;
        if (hooks) (el as unknown as Record<string, unknown>).hooks = hooks;
        if (data) (el as unknown as Record<string, unknown>).data = data;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[ToquePanel]", err);
      });

    return () => {
      alive = false;
    };
  }, [tag, data, hooks]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onLogout) return;
    const handler = () => onLogout();
    el.addEventListener("toque:logout", handler);
    return () => el.removeEventListener("toque:logout", handler);
  }, [onLogout]);

  return createElement(tag as string, {
    ref,
    theme,
    ...(hideHeader ? { "hide-header": "" } : {}),
  });
}
