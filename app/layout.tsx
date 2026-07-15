import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { AuthModalProvider } from "./components/AuthModalProvider";
import { LoginModal } from "./components/LoginModal";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "Reseñas y Ofertas Locales",
  description: "Descubre negocios, lee reseñas y aprovecha ofertas cerca de ti.",
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
          <Navbar />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <LoginModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}
