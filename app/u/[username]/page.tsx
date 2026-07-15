import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ReviewCard } from "../../components/ReviewCard";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const user = await prisma.user.findFirst({
    where: { name: { equals: username, mode: "insensitive" } },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          business: { select: { name: true } },
        },
      },
    },
  });

  if (!user) return notFound();

  const level = Math.floor(user.reviews.length / 5) + 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-3xl text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{user.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Nivel {level}</p>
          <p className="mt-2 text-sm text-[var(--primary)]">{user.reviews.length} reseñas</p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Reseñas</h2>
      {user.reviews.length === 0 ? (
        <p className="text-[var(--muted-foreground)]">Aún no ha escrito reseñas.</p>
      ) : (
        <div className="grid gap-4">
          {user.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={{
                ...review,
                user: { name: user.name, image: user.image },
                createdAt: new Date(review.createdAt),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
