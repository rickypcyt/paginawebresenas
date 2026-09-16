"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useAuthModal } from "./AuthModalProvider";

export function RegisterBusinessButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const { open } = useAuthModal();

  if (isPending) {
    return (
      <span className={className}>Cargando...</span>
    );
  }

  if (session) {
    return (
      <Link href="/businesses/new" className={className}>
        {children ?? "Registrar mi negocio"}
      </Link>
    );
  }

  return (
    <button onClick={open} className={className}>
      {children ?? "Registrar mi negocio"}
    </button>
  );
}
