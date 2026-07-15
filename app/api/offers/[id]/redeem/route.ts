import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { awardAction } from "@/lib/gamification";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.offerRedemption.findUnique({
      where: { userId_offerId: { userId: session.user.id, offerId: id } },
    });

    if (existing) {
      return NextResponse.json({ redemption: existing });
    }

    const redemption = await prisma.offerRedemption.create({
      data: { userId: session.user.id, offerId: id },
    });

    await awardAction(session.user.id, "redeem_offer");

    return NextResponse.json({ redemption });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
