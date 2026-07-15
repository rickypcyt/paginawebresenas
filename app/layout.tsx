import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthModalProvider } from "./components/AuthModalProvider";
import { LoginModal } from "./components/LoginModal";

export const metadata: Metadata = {
  title: {
    default: "Descubre Local — Negocios, reseñas y ofertas verificadas",
    template: "%s | Descubre Local",
  },
  description:
    "Descubre negocios verificados, lee reseñas reales y aprovecha ofertas cerca de ti. Gana puntos visitando locales y compartiendo experiencias.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Descubre Local",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <AuthModalProvider>
          {children}
          <LoginModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
