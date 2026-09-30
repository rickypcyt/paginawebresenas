import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Prisma } from "@/src/generated/prisma/client";
import prisma from "@/lib/prisma";
import { sendEmail, employeeApprovedEmail } from "@/lib/email";
import { rateLimit, rateLimitResponse, requireAdmin, withErrorHandler } from "@/lib/api-utils";

interface JoinRequestRouteProps {
  params: Promise<{ id: string }>;
}

export const PATCH = withErrorHandler(async (request: Request, context: JoinRequestRouteProps) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;
  const { user } = result.session;
  if (!rateLimit(`review-employee-join:${user.id}`, 20, 60_000)) return rateLimitResponse();

  const { id } = await context.params;
  const body = await request.json();
  const action = body.action === "approve" || body.action === "reject" ? body.action : null;
  if (!action) return NextResponse.json({ error: "Acción inválida" }, { status: 400 });

  const joinRequest = await prisma.employeeJoinRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      business: { select: { name: true } },
    },
  });
  if (!joinRequest) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (joinRequest.status !== "pending") {
    return NextResponse.json({ error: "Esta solicitud ya fue revisada" }, { status: 409 });
  }

  if (action === "reject") {
    await prisma.employeeJoinRequest.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date() },
    });
    return NextResponse.json({ status: "rejected" });
  }

  if (joinRequest.user.role !== "user") {
    return NextResponse.json({ error: "La cuenta ya tiene otro tipo de acceso" }, { status: 409 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingEmployee = await tx.employee.findUnique({
        where: { userId: joinRequest.userId },
        select: { id: true },
      });
      if (existingEmployee) throw new Error("ALREADY_ASSOCIATED");

      const employee = await tx.employee.create({
        data: {
          userId: joinRequest.userId,
          businessId: joinRequest.businessId,
          name: joinRequest.user.name,
          role: joinRequest.jobTitle,
        },
      });
      await tx.nfcTag.create({
        data: {
          token: randomUUID(),
          label: `NFC de ${employee.name}`,
          type: "employee_review",
          businessId: joinRequest.businessId,
          employeeId: employee.id,
        },
      });
      await tx.user.update({ where: { id: joinRequest.userId }, data: { role: "employee" } });
      await tx.employeeJoinRequest.update({
        where: { id },
        data: { status: "approved", reviewedAt: new Date() },
      });
      await tx.employeeJoinRequest.updateMany({
        where: { userId: joinRequest.userId, id: { not: id }, status: "pending" },
        data: { status: "rejected", reviewedAt: new Date() },
      });
    }, { timeout: 15000, maxWait: 15000 });
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_ASSOCIATED") {
      return NextResponse.json({ error: "El usuario ya pertenece a un negocio" }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "El usuario ya pertenece a un negocio" }, { status: 409 });
    }
    throw error;
  }

  const mail = employeeApprovedEmail(joinRequest.user.name, joinRequest.business.name);
  sendEmail(joinRequest.user.email, mail.subject, mail.html).catch((e) =>
    console.error("[email] Error enviando aprobación de empleado:", e)
  );

  return NextResponse.json({ status: "approved" });
});
