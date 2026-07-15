import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { awardAction } from "@/lib/gamification";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

export async function GET() {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const reviews = await prisma.review.findMany({
    where: { userId: result.session.user.id },
    orderBy: { createdAt: "desc" },
    include: { business: true },
  });

  return NextResponse.json({ reviews, count: reviews.length });
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;

  if (!rateLimit(`create-review:${user.id}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const rating = Number(body.rating);
  const businessId: string | undefined = body.businessId;
  const businessSlug: string | undefined = body.businessSlug;

  if (!title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "La valoración debe ser entre 1 y 5" }, { status: 400 });
  }

  let resolvedBusinessId = businessId;
  if (!resolvedBusinessId && businessSlug) {
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      select: { id: true },
    });
    if (business) resolvedBusinessId = business.id;
  }

  if (!resolvedBusinessId) {
    return NextResponse.json(
      { error: "Debes seleccionar un negocio" },
      { status: 400 }
    );
  }

  const previousReviews = await prisma.review.count({
    where: { businessId: resolvedBusinessId },
  });
  const userReviews = await prisma.review.count({
    where: { userId: user.id },
  });

  const recentVisit = await prisma.visit.findFirst({
    where: {
      userId: user.id,
      businessId: resolvedBusinessId,
      createdAt: { gte: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  const review = await prisma.review.create({
    data: {
      title,
      content,
      rating,
      userId: user.id,
      businessId: resolvedBusinessId,
      verification: recentVisit ? recentVisit.verification : "none",
      visitId: recentVisit?.id,
    },
  });

  await awardAction(user.id, userReviews === 0 ? "first_review" : "review");
  if (previousReviews === 0) {
    await awardAction(user.id, "discover_business");
  }

  return NextResponse.json({ review });
});
