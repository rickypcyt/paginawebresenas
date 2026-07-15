import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQrToken } from "@/lib/verification";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";
import { isAdmin } from "@/lib/roles";

export const GET = withErrorHandler(async (
  _request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
    select: { ownerId: true, name: true, slug: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  if (business.ownerId !== user.id && !isAdmin(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const daily = generateQrToken(id, "day");
  const dynamic = generateQrToken(id, "30s");

  return NextResponse.json({
    daily,
    dynamic,
    expiresIn: 30,
  });
});
