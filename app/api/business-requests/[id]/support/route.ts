import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const existing = await prisma.businessRequestSupporter.findUnique({
    where: { requestId_userId: { requestId: id, userId } },
  });

  if (existing) {
    await prisma.businessRequestSupporter.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ supported: false });
  }

  await prisma.businessRequestSupporter.create({
    data: { requestId: id, userId },
  });

  return NextResponse.json({ supported: true });
}
