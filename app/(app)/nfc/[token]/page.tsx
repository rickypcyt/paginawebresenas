import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import prisma from "@/lib/prisma";
import { createScanToken } from "@/lib/nfc-scan";

interface NfcPageProps {
  params: Promise<{ token: string }>;
}

export default async function NfcPage({ params }: NfcPageProps) {
  const { token } = await params;
  const tag = await prisma.nfcTag.findUnique({
    where: { token },
    include: {
      business: { select: { name: true, slug: true, googleReviewUrl: true, address: true, city: true } },
      employee: { select: { id: true, name: true, active: true } },
    },
  });

  if (!tag || !tag.active || (tag.employee && !tag.employee.active)) return notFound();

  // El conteo se actualiza después de responder — el tap no espera este query
  after(() =>
    prisma.nfcTag
      .update({ where: { id: tag.id }, data: { scanCount: { increment: 1 } } })
      .then(() => {})
  );

  if (tag.type === "business_google") {
    const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${tag.business.name} ${tag.business.city || ""} ${tag.business.address || ""}`.trim()
    )}`;
    redirect(tag.business.googleReviewUrl || fallback);
  }

  // Tag general del negocio — reseña sin empleado asociado
  if (tag.type === "business_review") {
    redirect(`/business/${tag.business.slug}/review?nfc=${createScanToken(tag.token)}`);
  }

  if (!tag.employee) return notFound();

  // El parámetro nfc lleva un token firmado que caduca en 10 min — no se puede compartir
  redirect(
    `/business/${tag.business.slug}/review?employee=${tag.employee.id}&nfc=${createScanToken(tag.token)}`
  );
}
