import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { awardAction } from "@/lib/gamification";
import { requireSession, requireAdmin, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";
import { isAdmin as checkIsAdmin } from "@/lib/roles";
import { randomUUID } from "node:crypto";

export async function GET() {
  const result = await requireSession();
  if ("error" in result) {
    const businesses = await prisma.business.findMany({
      where: { status: { in: ["community", "verified", "premium"] } },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return NextResponse.json({ businesses, isAdmin: false });
  }

  const admin = checkIsAdmin(result.session.user.role);
  const businesses = await prisma.business.findMany({
    where: admin ? {} : { status: { in: ["community", "verified", "premium"] } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json({ businesses, isAdmin: admin });
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { user } = result.session;

  if (!rateLimit(`create-business:${user.id}`, 20, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const category: string | undefined = body.category;
  const categoryId: string | undefined = body.categoryId;
  const newCategory: string | undefined = body.newCategory;
  const address: string | undefined = body.address;
  const city: string | undefined = body.city;
  const phone: string | undefined = body.phone;
  const website: string | undefined = body.website;
  const googleReviewUrl: string | undefined = body.googleReviewUrl;
  const instagram: string | undefined = body.instagram;
  const hours: string | undefined = body.hours;
  const description: string | undefined = body.description;
  const latitude: number | undefined = typeof body.latitude === "number" ? body.latitude : undefined;
  const longitude: number | undefined = typeof body.longitude === "number" ? body.longitude : undefined;
  const ownerEmail: string | undefined =
    typeof body.ownerEmail === "string" ? body.ownerEmail.trim().toLowerCase() || undefined : undefined;

  let owner: { id: string } | null = null;
  if (ownerEmail) {
    owner = await prisma.user.findUnique({
      where: { email: ownerEmail },
      select: { id: true },
    });
    if (!owner) {
      return NextResponse.json({ error: "No existe una cuenta con ese email" }, { status: 400 });
    }
  }

  const baseSlug = slugify(name);
  const existingSlugs = (
    await prisma.business.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
  ).map((b) => b.slug);

  let finalCategoryId = categoryId || null;

  if (categoryId === "new" && newCategory?.trim()) {
    const categoryName = newCategory.trim();
    const categorySlug = slugify(categoryName);
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    finalCategoryId = existingCategory
      ? existingCategory.id
      : (
          await prisma.category.create({
            data: { name: categoryName, slug: categorySlug, icon: "🏷️" },
          })
        ).id;
  } else if (!finalCategoryId && category) {
    const cat = await prisma.category.findUnique({
      where: { slug: slugify(category) },
    });
    if (cat) finalCategoryId = cat.id;
  }

  const [business] = await prisma.$transaction([
    prisma.business.create({
      data: {
        name,
        slug: generateUniqueSlug(name, existingSlugs),
        categoryId: finalCategoryId,
        ownerId: owner?.id ?? null,
        address: address || null,
        city: city || null,
        phone: phone || null,
        website: website || null,
        googleReviewUrl: googleReviewUrl || null,
        instagram: instagram || null,
        hours: hours || null,
        description: description || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    }),
    ...(owner
      ? [
          prisma.user.updateMany({
            where: { id: owner.id, role: { not: "admin" } },
            data: { role: "business" },
          }),
        ]
      : []),
  ]);

  await prisma.nfcTag.create({
    data: {
      token: randomUUID(),
      label: "NFC reseñas de Google",
      type: "business_google",
      businessId: business.id,
    },
  });

  await awardAction(owner?.id ?? user.id, "add_business");

  return NextResponse.json({ business });
});
