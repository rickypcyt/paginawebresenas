import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "../../components/ReviewCard";

export default async function DashboardReviewsPage() {
  const session = await getSession();
  const businessIds = (
    await prisma.business.findMany({
      where: { ownerId: session?.user?.id },
      select: { id: true },
    })
  ).map((b) => b.id);

  const reviews = await prisma.review.findMany({
    where: { businessId: { in: businessIds } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      business: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Reseñas de tus negocios</h1>
      {reviews.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no hay reseñas.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
