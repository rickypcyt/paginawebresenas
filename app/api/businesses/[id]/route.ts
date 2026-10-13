import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";
import { isAdmin } from "@/lib/roles";

const STATUSES = ["community", "claim_pending", "verified", "premium"];
const TEXT_FIELDS = [
  "name",
  "description",
  "address",
  "city",
  "phone",
  "website",
  "googleReviewUrl",
  "instagram",
  "hours",
  "imageUrl",
  "categoryId",
];

type Ctx = RouteContext<{ id: string }>;

async function canManageBusiness(userId: string, role: string, businessId: string) {
  if (isAdmin(role)) return true;
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  });
  return business?.ownerId === userId;
}

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  for (const field of TEXT_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = typeof value === "string" && value.trim() ? value.trim() : null;
    }
  }

  if (typeof body.status === "string" && STATUSES.includes(body.status)) {
    data.status = body.status;
  }
  if (typeof body.featured === "boolean") {
    data.featured = body.featured;
  }

  const business = await prisma.business.update({ where: { id }, data });
  return NextResponse.json({ business });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await prisma.business.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
