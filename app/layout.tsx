import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { LoginModal } from "@/components/auth/LoginModal";

export const metadata: Metadata = {
  title: {
    default: "Toque — Deja tu reseña en un Toque",
    template: "%s | Toque",
  },
  description:
    "Plataforma para gestionar NFCs que llevan a los clientes a reseñas de Google o a valorar a empleados.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Toque",
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
