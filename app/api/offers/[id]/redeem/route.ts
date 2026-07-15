import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
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

  const existing = await prisma.offerRedemption.findUnique({
    where: { userId_offerId: { userId: user.id, offerId: id } },
  });

  if (existing) {
    return NextResponse.json({ redemption: existing });
  }

  const redemption = await prisma.offerRedemption.create({
    data: { userId: user.id, offerId: id },
  });

  await awardAction(user.id, "redeem_offer");

  return NextResponse.json({ redemption });
});
