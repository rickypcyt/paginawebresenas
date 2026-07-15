"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <p className="text-gray-400">Cargando sesión...</p>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{session.user.email}</span>
        <button
          onClick={() => signOut()}
          className="rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-500"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn.social({ provider: "google" })}
      className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
    >
      Iniciar sesión con Google
    </button>
  );
}
