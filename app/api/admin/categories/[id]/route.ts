import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

type Ctx = RouteContext<{ id: string }>;

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.slug === "string" && body.slug.trim()) data.slug = body.slug.trim();
  if (typeof body.icon === "string") data.icon = body.icon.trim() || null;

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json({ category });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
