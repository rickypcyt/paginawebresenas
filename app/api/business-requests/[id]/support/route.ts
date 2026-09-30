import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";

export const POST = withErrorHandler(async (
  _request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id } = await params;
  const userId = result.session.user.id;

  const request = await prisma.businessRequest.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }
  if (request.status === "rejected") {
    return NextResponse.json({ error: "No puedes apoyar una solicitud rechazada" }, { status: 400 });
  }

  try {
    const deleted = await prisma.businessRequestSupporter.deleteMany({
      where: { requestId: id, userId },
    });
    if (deleted.count > 0) {
      return NextResponse.json({ supported: false });
    }
    await prisma.businessRequestSupporter.create({
      data: { requestId: id, userId },
    });
    return NextResponse.json({ supported: true });
  } catch (error) {
    // Doble click / requests concurrentes: responde según el estado final.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ supported: true });
    }
    throw error;
  }
});
