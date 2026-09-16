"use client";

import { useAuthModal } from "./AuthModalProvider";

interface LoginButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LoginButton({ children, className }: LoginButtonProps) {
  const { open } = useAuthModal();

  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  );
}
