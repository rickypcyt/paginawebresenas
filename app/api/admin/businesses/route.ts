import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { requireAdmin, withErrorHandler } from "@/lib/api-utils";

const STATUSES = ["community", "claim_pending", "verified", "premium"];

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  const existing = (
    await prisma.business.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
  ).map((b) => b.slug);

  const ownerId = typeof body.ownerId === "string" && body.ownerId ? body.ownerId : null;
  if (ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { id: true } });
    if (!owner) {
      return NextResponse.json({ error: "El dueño seleccionado no existe" }, { status: 400 });
    }
  }

  const business = await prisma.business.create({
    data: {
      name,
      slug: generateUniqueSlug(name, existing),
      categoryId: body.categoryId || null,
      ownerId,
      city: typeof body.city === "string" && body.city.trim() ? body.city.trim() : null,
      address: typeof body.address === "string" && body.address.trim() ? body.address.trim() : null,
      phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null,
      status: STATUSES.includes(body.status) ? body.status : "community",
      featured: body.featured === true,
    },
  });

  // El dueño de un negocio pasa a rol business.
  if (ownerId) {
    await prisma.user.update({ where: { id: ownerId }, data: { role: "business" } });
  }

  return NextResponse.json({ business }, { status: 201 });
});
