import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse, requireSession, withErrorHandler } from "@/lib/api-utils";
import { isAdmin } from "@/lib/roles";

interface EmployeesRouteProps {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (request: Request, context: EmployeesRouteProps) => {
  const result = await requireSession();
  if ("error" in result) return result.error;
  const { user: actor } = result.session;
  if (!rateLimit(`create-employee:${actor.id}`, 30, 60_000)) return rateLimitResponse();

  const { id } = await context.params;
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim().slice(0, 80) : "";
  const userEmail = typeof body.userEmail === "string" ? body.userEmail.trim().toLowerCase() : "";
  if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

  const business = await prisma.business.findUnique({
    where: { id },
    select: { id: true, ownerId: true },
  });
  if (!business) return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });

  // Solo el dueño del negocio o un admin puede dar de alta empleados.
  if (business.ownerId !== actor.id && !isAdmin(actor.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  let user: { id: string; role: string; name: string } | null = null;
  if (userEmail) {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: "No existe una cuenta con ese email" }, { status: 400 });
    }
    if (user.role !== "user") {
      return NextResponse.json({ error: "La cuenta ya tiene otro tipo de acceso" }, { status: 409 });
    }
    const existingEmployee = await prisma.employee.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (existingEmployee) {
      return NextResponse.json({ error: "El usuario ya pertenece a un negocio" }, { status: 409 });
    }
  }

  const employee = await prisma.$transaction(async (tx) => {
    const created = await tx.employee.create({
      data: {
        name,
        role: role || null,
        businessId: id,
        userId: user?.id ?? null,
      },
    });
    await tx.nfcTag.create({
      data: {
        token: randomUUID(),
        label: `NFC de ${created.name}`,
        type: "employee_review",
        businessId: id,
        employeeId: created.id,
      },
    });
    if (user) {
      await tx.user.update({ where: { id: user.id }, data: { role: "employee" } });
      await tx.employeeJoinRequest.updateMany({
        where: { userId: user.id, status: "pending" },
        data: { status: "rejected", reviewedAt: new Date() },
      });
    }
    return created;
  });

  return NextResponse.json({ employee }, { status: 201 });
});
