import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/roles";
import { generateUniqueSlug, slugify } from "@/lib/slug";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const { name, icon, description } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const existing = await prisma.category.findMany({ select: { slug: true } });
    const existingSlugs = existing.map((c) => c.slug);
    const slug = generateUniqueSlug(name, existingSlugs);

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        icon: icon?.trim() || "🏷️",
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
