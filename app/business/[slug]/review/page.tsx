import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewForm } from "./ReviewForm";
import { ReviewLoginPrompt } from "./ReviewLoginPrompt";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const session = await getSession();

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, address: true, city: true },
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
      {session?.user?.id ? <ReviewForm business={business} /> : <ReviewLoginPrompt />}
    </div>
  );
}
