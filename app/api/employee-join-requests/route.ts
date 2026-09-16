import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse, requireSession, withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;
  const { user } = result.session;

  if (user.role !== "user") {
    return NextResponse.json({ error: "Tu cuenta no puede solicitar acceso como empleado" }, { status: 403 });
  }
  if (!rateLimit(`employee-join:${user.id}`, 5, 60_000)) return rateLimitResponse();

  const body = await request.json();
  const businessId = typeof body.businessId === "string" ? body.businessId : "";
  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim().slice(0, 80) : "";
  if (!businessId) {
    return NextResponse.json({ error: "Selecciona un negocio" }, { status: 400 });
  }

  const [employee, pendingRequest, business] = await Promise.all([
    prisma.employee.findUnique({ where: { userId: user.id }, select: { id: true } }),
    prisma.employeeJoinRequest.findFirst({ where: { userId: user.id, status: "pending" }, select: { businessId: true } }),
    prisma.business.findFirst({
      where: { id: businessId, ownerId: { not: null } },
      select: { id: true, ownerId: true },
    }),
  ]);

  if (employee) return NextResponse.json({ error: "Ya perteneces a un negocio" }, { status: 409 });
  if (!business) return NextResponse.json({ error: "El negocio no está disponible" }, { status: 404 });
  if (business.ownerId === user.id) {
    return NextResponse.json({ error: "El propietario no puede solicitar acceso como empleado" }, { status: 400 });
  }
  if (pendingRequest && pendingRequest.businessId !== businessId) {
    return NextResponse.json({ error: "Ya tienes una solicitud pendiente en otro negocio" }, { status: 409 });
  }

  const joinRequest = await prisma.employeeJoinRequest.upsert({
    where: { userId_businessId: { userId: user.id, businessId } },
    update: { jobTitle: jobTitle || null, status: "pending", reviewedAt: null },
    create: { userId: user.id, businessId, jobTitle: jobTitle || null },
    select: { id: true, status: true },
  });

  return NextResponse.json({ request: joinRequest }, { status: 201 });
});
