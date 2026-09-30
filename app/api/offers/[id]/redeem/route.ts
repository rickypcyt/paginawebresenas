import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/src/generated/prisma/client";
import { awardAction } from "@/lib/gamification";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";

export const POST = withErrorHandler(async (
  _request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  const { id } = await params;

  const offer = await prisma.offer.findUnique({
    where: { id },
    select: { id: true, startDate: true, endDate: true },
  });
  if (!offer) {
    return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
  }

  const now = new Date();
  if ((offer.startDate && offer.startDate > now) || (offer.endDate && offer.endDate < now)) {
    return NextResponse.json({ error: "La oferta no está vigente" }, { status: 410 });
  }

  const existing = await prisma.offerRedemption.findUnique({
    where: { userId_offerId: { userId: user.id, offerId: id } },
  });

  if (existing) {
    return NextResponse.json({ redemption: existing });
  }

  try {
    const redemption = await prisma.offerRedemption.create({
      data: { userId: user.id, offerId: id },
    });
    await awardAction(user.id, "redeem_offer");
    return NextResponse.json({ redemption });
  } catch (error) {
    // Dos requests concurrentes: la segunda choca con el índice único.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const redemption = await prisma.offerRedemption.findUnique({
        where: { userId_offerId: { userId: user.id, offerId: id } },
      });
      return NextResponse.json({ redemption });
    }
    throw error;
  }
});
