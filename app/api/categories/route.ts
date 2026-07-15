import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler } from "@/lib/api-utils";
import { generateUniqueSlug, slugify } from "@/lib/slug";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  const existingSlugs = (
    await prisma.category.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
  ).map((c) => c.slug);
  const slug = generateUniqueSlug(name, existingSlugs);

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      icon: typeof body.icon === "string" ? body.icon.trim() || "🏷️" : "🏷️",
      description: typeof body.description === "string" ? body.description.trim() || null : null,
    },
  });

  return NextResponse.json({ category });
});
