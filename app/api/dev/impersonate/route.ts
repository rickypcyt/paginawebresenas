import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { requireSession, withErrorHandler } from "@/lib/api-utils";

const ROLES = new Set(["user", "employee", "business", "admin"]);

async function ensureDemoBusiness(ownerId: string | null) {
  const existing = await prisma.business.findFirst({
    where: ownerId ? { ownerId } : {},
    select: { id: true },
  });
  if (existing) return existing;

  const name = "Café Demo";
  const baseSlug = slugify(name);
  const existingSlugs = (
    await prisma.business.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
  ).map((b) => b.slug);

  const business = await prisma.business.create({
    data: {
      name,
      slug: generateUniqueSlug(name, existingSlugs),
      ownerId,
      city: "Guayaquil",
      status: "verified",
    },
    select: { id: true },
  });
  await prisma.nfcTag.create({
    data: {
      token: randomUUID(),
      label: "NFC reseñas de Google",
      type: "business_google",
      businessId: business.id,
    },
  });
  return business;
}

export const POST = withErrorHandler(async (request: Request) => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }

  const result = await requireSession();
  if ("error" in result) return result.error;
  const { user } = result.session;

  const body = await request.json();
  const role = typeof body.role === "string" && ROLES.has(body.role) ? body.role : null;
  if (!role) return NextResponse.json({ error: "Rol inválido" }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: { role } });

  if (role === "business") {
    await ensureDemoBusiness(user.id);
  }

  if (role === "employee") {
    const employee = await prisma.employee.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!employee) {
      const business = await ensureDemoBusiness(null);
      const created = await prisma.employee.create({
        data: {
          userId: user.id,
          businessId: business.id,
          name: user.name || "Empleado Demo",
          role: "Demo",
        },
      });
      await prisma.nfcTag.create({
        data: {
          token: randomUUID(),
          label: `NFC de ${created.name}`,
          type: "employee_review",
          businessId: business.id,
          employeeId: created.id,
        },
      });
    }
  }

  return NextResponse.json({ role });
});
