import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ReviewCard } from "../../components/ReviewCard";

export default async function ProfileReviewsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/explore");

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      business: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">Mis reseñas</h1>
      {reviews.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no has escrito reseñas.</p>
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
