"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type AuthIntent = "default" | "customer";

interface AuthModalContextValue {
  isOpen: boolean;
  redirectTo: string | null;
  intent: AuthIntent;
  open: (redirectTo?: string, intent?: AuthIntent) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [intent, setIntent] = useState<AuthIntent>("default");

  const open = useCallback((to?: string, i?: AuthIntent) => {
    setRedirectTo(to ?? null);
    setIntent(i ?? "default");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setRedirectTo(null);
    setIntent("default");
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, redirectTo, intent, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal debe usarse dentro de AuthModalProvider");
  }
  return context;
}
