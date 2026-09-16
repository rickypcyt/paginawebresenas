import Link from "next/link";
import { RegisterBusinessButton } from "@/components/auth/RegisterBusinessButton";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-bold text-[var(--foreground)]">Descubre Local</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Gestiona reseñas con NFC para tu negocio y para cada miembro de tu equipo.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Para negocios</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <RegisterBusinessButton className="inline-block bg-transparent border-0 p-0 text-left text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer">Registra tu negocio</RegisterBusinessButton>
              </li>
              <li>
                <Link href="/como-funciona" className="hover:text-[var(--primary)]">¿Cómo funciona?</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} Descubre Local. Hecho en Guayaquil.</p>
          <div className="flex gap-4">
            <Link href="/como-funciona" className="hover:text-[var(--primary)]">Ayuda</Link>
            <Link href="#" className="hover:text-[var(--primary)]">Privacidad</Link>
            <Link href="#" className="hover:text-[var(--primary)]">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
