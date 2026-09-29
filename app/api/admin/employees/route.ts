import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const businessId = typeof body.businessId === "string" ? body.businessId : "";
  const userId = typeof body.userId === "string" && body.userId ? body.userId : null;

  if (!name || !businessId) {
    return NextResponse.json(
      { error: "Nombre y negocio son obligatorios" },
      { status: 400 }
    );
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true },
  });
  if (!business) {
    return NextResponse.json({ error: "El negocio no existe" }, { status: 400 });
  }

  if (userId) {
    const existing = await prisma.employee.findUnique({ where: { userId }, select: { id: true } });
    if (existing) {
      return NextResponse.json(
        { error: "Ese usuario ya tiene una ficha de empleado" },
        { status: 400 }
      );
    }
  }

  const employee = await prisma.employee.create({
    data: {
      name,
      role: typeof body.role === "string" && body.role.trim() ? body.role.trim() : null,
      businessId,
      userId,
      active: body.active !== false,
    },
  });

  // El usuario vinculado pasa a rol employee.
  if (userId) {
    await prisma.user.update({ where: { id: userId }, data: { role: "employee" } });
  }

  return NextResponse.json({ employee }, { status: 201 });
});
