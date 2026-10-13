import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, RouteContext } from "@/lib/api-utils";
import { isAdmin } from "@/lib/roles";

async function canManageBusiness(userId: string, role: string, businessId: string) {
  if (isAdmin(role)) return true;
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  });
  return business?.ownerId === userId;
}

type Ctx = RouteContext<{ id: string; employeeId: string }>;

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id: businessId, employeeId } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, businessId))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, businessId },
    select: { id: true },
  });
  if (!employee) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.role === "string") data.role = body.role.trim() || null;
  if (typeof body.active === "boolean") data.active = body.active;

  const updated = await prisma.employee.update({ where: { id: employeeId }, data });
  return NextResponse.json({ employee: updated });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id: businessId, employeeId } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, businessId))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, businessId },
    select: { id: true },
  });
  if (!employee) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  await prisma.employee.delete({ where: { id: employeeId } });
  return NextResponse.json({ ok: true });
});
