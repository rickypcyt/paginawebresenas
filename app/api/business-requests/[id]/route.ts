import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { awardAction } from "@/lib/gamification";
import { requireAdmin, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

interface BusinessRequestRouteProps {
  params: Promise<{ id: string }>;
}

export const PATCH = withErrorHandler(async (request: Request, context: BusinessRequestRouteProps) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  const { user } = result.session;
  if (!rateLimit(`review-business-request:${user.id}`, 20, 60_000)) return rateLimitResponse();

  const { id } = await context.params;
  const body = await request.json();
  const action = body.action === "approve" || body.action === "reject" ? body.action : null;
  if (!action) return NextResponse.json({ error: "Acción inválida" }, { status: 400 });

  const businessRequest = await prisma.businessRequest.findUnique({ where: { id } });
  if (!businessRequest) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (businessRequest.status !== "pending") {
    return NextResponse.json({ error: "Esta solicitud ya fue revisada" }, { status: 409 });
  }

  if (action === "reject") {
    await prisma.businessRequest.update({ where: { id }, data: { status: "rejected" } });
    return NextResponse.json({ status: "rejected" });
  }

  const baseSlug = slugify(businessRequest.name);
  const existingSlugs = (
    await prisma.business.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
  ).map((b) => b.slug);

  const [business] = await prisma.$transaction([
    prisma.business.create({
      data: {
        name: businessRequest.name,
        slug: generateUniqueSlug(businessRequest.name, existingSlugs),
        categoryId: businessRequest.categoryId,
        ownerId: businessRequest.requesterId,
        address: businessRequest.address,
        city: businessRequest.city,
        description: businessRequest.description,
        status: "verified",
      },
    }),
    prisma.businessRequest.update({
      where: { id },
      data: { status: "registered" },
    }),
    prisma.user.updateMany({
      where: { id: businessRequest.requesterId, role: { not: "admin" } },
      data: { role: "business" },
    }),
  ]);

  await prisma.businessRequest.update({
    where: { id },
    data: { registeredBusinessId: business.id },
  });

  await prisma.nfcTag.create({
    data: {
      token: randomUUID(),
      label: "NFC reseñas de Google",
      type: "business_google",
      businessId: business.id,
    },
  });

  await awardAction(businessRequest.requesterId, "add_business");

  return NextResponse.json({ status: "approved", business });
});
