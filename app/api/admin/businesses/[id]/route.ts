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

  const ownerChanged = "ownerId" in body;
  let newOwnerId: string | null = null;
  if (ownerChanged) {
    newOwnerId = typeof body.ownerId === "string" && body.ownerId ? body.ownerId : null;
    if (newOwnerId) {
      const owner = await prisma.user.findUnique({ where: { id: newOwnerId }, select: { id: true } });
      if (!owner) return NextResponse.json({ error: "El dueño seleccionado no existe" }, { status: 400 });
    }
    data.ownerId = newOwnerId;
  }

  const business = await prisma.$transaction(async (tx) => {
    const previous = ownerChanged
      ? await tx.business.findUnique({ where: { id }, select: { ownerId: true } })
      : null;

    const updated = await tx.business.update({ where: { id }, data });

    if (ownerChanged) {
      if (newOwnerId) {
        await tx.user.updateMany({
          where: { id: newOwnerId, role: { not: "admin" } },
          data: { role: "business" },
        });
      }
      // Si el dueño anterior ya no posee ningún negocio, vuelve a rol user.
      const prevId = previous?.ownerId;
      if (prevId && prevId !== newOwnerId) {
        const stillOwns = await tx.business.count({ where: { ownerId: prevId } });
        if (stillOwns === 0) {
          await tx.user.updateMany({
            where: { id: prevId, role: "business" },
            data: { role: "user" },
          });
        }
      }
    }

    return updated;
  });
  return NextResponse.json({ business });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  await prisma.business.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
