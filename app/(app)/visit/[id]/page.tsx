import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyQrToken } from "@/lib/verification";
import { VisitLanding } from "./VisitLanding";

interface VisitPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string; mode?: string }>;
}

export default async function VisitPage({ params, searchParams }: VisitPageProps) {
  const { id } = await params;
  const { token, mode } = await searchParams;

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  if (!business) return notFound();

  const isTokenValid = token
    ? verifyQrToken(id, token, mode === "30s" ? "30s" : "day")
    : false;

  const rating = business.reviews.length
    ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
    : 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {!isTokenValid && (
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-center text-sm text-yellow-800">
          Este enlace o QR parece inválido o expirado. Aún puedes explorar el negocio.
        </div>
      )}
      <VisitLanding
        business={{
          id: business.id,
          name: business.name,
          slug: business.slug,
          address: business.address,
          city: business.city,
          description: business.description,
          rating,
          reviewCount: business.reviews.length,
        }}
        token={token || ""}
        mode={mode || "day"}
      />
    </div>
  );
}
