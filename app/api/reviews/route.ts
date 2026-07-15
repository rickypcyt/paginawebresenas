import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { awardAction } from "@/lib/gamification";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { business: true },
  });

  return NextResponse.json({ reviews, count: reviews.length });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { title, content, rating, businessId, businessSlug } = await request.json();

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
      where: { userId: session.user.id },
    });

    const recentVisit = await prisma.visit.findFirst({
      where: {
        userId: session.user.id,
        businessId: resolvedBusinessId,
        createdAt: { gte: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    const review = await prisma.review.create({
      data: {
        title: title || "Sin título",
        content: content || "",
        rating: Number(rating) || 0,
        userId: session.user.id,
        businessId: resolvedBusinessId,
        verification: recentVisit ? recentVisit.verification : "none",
        visitId: recentVisit?.id,
      },
    });

    await awardAction(session.user.id, userReviews === 0 ? "first_review" : "review");
    if (previousReviews === 0) {
      await awardAction(session.user.id, "discover_business");
    }

    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
