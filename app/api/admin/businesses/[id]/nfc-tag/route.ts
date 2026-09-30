import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

type Ctx = RouteContext<{ id: string }>;

export const POST = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id },
    select: { id: true, name: true },
  });
  if (!business) return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });

  const existing = await prisma.nfcTag.findFirst({
    where: { businessId: id, type: "business_review" },
    select: { token: true },
  });
  if (existing) return NextResponse.json({ token: existing.token });

  const tag = await prisma.nfcTag.create({
    data: {
      token: randomUUID(),
      label: `NFC de ${business.name}`,
      type: "business_review",
      businessId: id,
    },
  });

  return NextResponse.json({ token: tag.token }, { status: 201 });
});
