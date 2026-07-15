import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { awardAction } from "@/lib/gamification";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      })
    : null;

  const isAdmin = user?.role === "admin";

  const businesses = await prisma.business.findMany({
    where: isAdmin
      ? {}
      : { status: { in: ["community", "verified", "premium"] } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json({ businesses, isAdmin });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const {
      name,
      category,
      categoryId,
      newCategory,
      address,
      city,
      phone,
      website,
      instagram,
      hours,
      description,
      latitude,
      longitude,
    } = await request.json();

    const existing = await prisma.business.findMany({
      select: { slug: true },
    });
    const existingSlugs = existing.map((b) => b.slug);

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
          name: name || "Sin nombre",
          slug: generateUniqueSlug(name || "sin-nombre", existingSlugs),
          categoryId: finalCategoryId,
          ownerId: session.user.id,
          address: address || null,
          city: city || null,
          phone: phone || null,
          website: website || null,
          instagram: instagram || null,
          hours: hours || null,
          description: description || null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
        },
      }),
      prisma.user.updateMany({
        where: { id: session.user.id, role: { not: "admin" } },
        data: { role: "business" },
      }),
    ]);

    await awardAction(session.user.id, "add_business");

    return NextResponse.json({ business });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
