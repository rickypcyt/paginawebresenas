import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
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

type Ctx = RouteContext<{ id: string; requestId: string }>;

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { id: businessId, requestId } = await params;
  const { user } = result.session;

  if (!(await canManageBusiness(user.id, user.role, businessId))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const action = body.action === "approve" || body.action === "reject" ? body.action : null;
  if (!action) return NextResponse.json({ error: "Acción inválida" }, { status: 400 });

  const joinRequest = await prisma.employeeJoinRequest.findUnique({
    where: { id: requestId },
    include: { user: { select: { id: true, name: true, role: true } }, business: { select: { id: true } } },
  });

  if (!joinRequest) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (joinRequest.business.id !== businessId) {
    return NextResponse.json({ error: "La solicitud no pertenece a este negocio" }, { status: 400 });
  }
  if (joinRequest.status !== "pending") {
    return NextResponse.json({ error: "Esta solicitud ya fue revisada" }, { status: 409 });
  }

  if (action === "reject") {
    await prisma.employeeJoinRequest.update({
      where: { id: requestId },
      data: { status: "rejected", reviewedAt: new Date() },
    });
    return NextResponse.json({ status: "rejected" });
  }

  if (joinRequest.user.role !== "user") {
    return NextResponse.json({ error: "La cuenta ya tiene otro tipo de acceso" }, { status: 409 });
  }

  const employee = await prisma.$transaction(async (tx) => {
    const existing = await tx.employee.findUnique({ where: { userId: joinRequest.userId }, select: { id: true } });
    if (existing) throw new Error("ALREADY_ASSOCIATED");

    const created = await tx.employee.create({
      data: {
        userId: joinRequest.userId,
        businessId,
        name: joinRequest.user.name,
        role: joinRequest.jobTitle,
      },
    });
    await tx.nfcTag.create({
      data: {
        token: randomUUID(),
        label: `NFC de ${created.name}`,
        type: "employee_review",
        businessId,
        employeeId: created.id,
      },
    });
    await tx.user.update({ where: { id: joinRequest.userId }, data: { role: "employee" } });
    await tx.employeeJoinRequest.update({
      where: { id: requestId },
      data: { status: "approved", reviewedAt: new Date() },
    });
    await tx.employeeJoinRequest.updateMany({
      where: { userId: joinRequest.userId, id: { not: requestId }, status: "pending" },
      data: { status: "rejected", reviewedAt: new Date() },
    });
    return created;
  });

  return NextResponse.json({ status: "approved", employee });
});
