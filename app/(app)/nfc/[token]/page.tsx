import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";

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

  await prisma.nfcTag.update({ where: { id: tag.id }, data: { scanCount: { increment: 1 } } });

  if (tag.type === "business_google") {
    const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${tag.business.name} ${tag.business.city || ""} ${tag.business.address || ""}`.trim()
    )}`;
    redirect(tag.business.googleReviewUrl || fallback);
  }

  if (!tag.employee) return notFound();

  redirect(`/business/${tag.business.slug}/review?employee=${tag.employee.id}&nfc=${tag.token}`);
}
