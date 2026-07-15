import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

export async function GET() {
  const requests = await prisma.businessRequest.findMany({
    where: { status: { not: "rejected" } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { supporters: true } },
      requester: { select: { name: true } },
      supporters: { select: { userId: true } },
    },
  });

  return NextResponse.json({ requests });
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;

  if (!rateLimit(`create-request:${user.id}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const businessRequest = await prisma.businessRequest.create({
    data: {
      name,
      address: typeof body.address === "string" ? body.address.trim() || null : null,
      city: typeof body.city === "string" ? body.city.trim() || null : null,
      categoryId: typeof body.categoryId === "string" ? body.categoryId || null : null,
      categoryName: typeof body.categoryName === "string" ? body.categoryName.trim() || null : null,
      description: typeof body.description === "string" ? body.description.trim() || null : null,
      requesterId: user.id,
    },
  });

  return NextResponse.json({ businessRequest });
});
