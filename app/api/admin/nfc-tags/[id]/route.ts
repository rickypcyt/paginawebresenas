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

  if (typeof body.label === "string" && body.label.trim()) data.label = body.label.trim();
  if (typeof body.active === "boolean") data.active = body.active;

  const tag = await prisma.nfcTag.update({ where: { id }, data });
  return NextResponse.json({ tag });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  await prisma.nfcTag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
