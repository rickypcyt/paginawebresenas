import Link from "next/link";
import { AuthButton } from "./AuthButton";

const links = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/negocios", label: "Negocios" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[var(--primary)]">
          Descubre<span className="text-[var(--foreground)]">Local</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/business-requests"
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)] sm:block"
          >
            Solicitar negocio
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
