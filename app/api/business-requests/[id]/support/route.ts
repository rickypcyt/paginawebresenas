import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";

export const POST = withErrorHandler(async (
  _request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id } = await params;
  const userId = result.session.user.id;

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
});
