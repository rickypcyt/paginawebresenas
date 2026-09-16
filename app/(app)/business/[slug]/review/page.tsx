import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BusinessReviewForm } from "./BusinessReviewForm";
import { ReviewLoginPrompt } from "./ReviewLoginPrompt";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ employee?: string; nfc?: string }>;
}

export default async function BusinessReviewPage({ params, searchParams }: ReviewPageProps) {
  const { slug } = await params;
  const { employee: employeeId, nfc: nfcToken } = await searchParams;
  const session = await getSession();

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, address: true, city: true, employees: { where: { active: true }, select: { id: true, name: true, role: true } } },
  });

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
        Escribir reseña
      </h1>
      <p className="mb-6 text-[var(--muted-foreground)]">
        Sobre <span className="font-medium text-[var(--foreground)]">{business.name}</span>
      </p>
      {employeeId && business.employees.length > 0 && !business.employees.some((employee) => employee.id === employeeId) ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">El enlace NFC no es válido.</p>
      ) : session?.user?.id ? (
        <BusinessReviewForm
          business={business}
          employee={business.employees.find((employee) => employee.id === employeeId)}
          nfcToken={nfcToken}
        />
      ) : (
        <ReviewLoginPrompt />
      )}
    </div>
  );
}
