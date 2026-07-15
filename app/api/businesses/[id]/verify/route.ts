import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

export const POST = withErrorHandler(async (
  _request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;

  const business = await prisma.business.update({
    where: { id },
    data: { status: "verified" },
  });

  return NextResponse.json({ business });
});
