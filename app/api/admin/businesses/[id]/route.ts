import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

const STATUSES = ["community", "claim_pending", "verified", "premium"];
const TEXT_FIELDS = ["name", "slug", "description", "address", "city", "phone", "website", "googleReviewUrl", "instagram", "hours", "imageUrl", "categoryId"];

type Ctx = RouteContext<{ id: string }>;

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};

  for (const field of TEXT_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = typeof value === "string" && value.trim() ? value.trim() : null;
    }
  }
  if (typeof body.status === "string" && STATUSES.includes(body.status)) data.status = body.status;
  if (typeof body.featured === "boolean") data.featured = body.featured;
  if ("ownerId" in body) {
    const ownerId = typeof body.ownerId === "string" && body.ownerId ? body.ownerId : null;
    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { id: true } });
      if (!owner) return NextResponse.json({ error: "El dueño seleccionado no existe" }, { status: 400 });
      await prisma.user.update({ where: { id: ownerId }, data: { role: "business" } });
    }
    data.ownerId = ownerId;
  }

  const business = await prisma.business.update({ where: { id }, data });
  return NextResponse.json({ business });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  await prisma.business.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
