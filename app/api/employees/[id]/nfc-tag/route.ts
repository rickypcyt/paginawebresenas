import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse, requireSession, withErrorHandler } from "@/lib/api-utils";
import { isAdmin } from "@/lib/roles";

interface NfcTagRouteProps {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (_request: Request, context: NfcTagRouteProps) => {
  const result = await requireSession();
  if ("error" in result) return result.error;
  const { user } = result.session;
  if (!rateLimit(`employee-nfc:${user.id}`, 20, 60_000)) return rateLimitResponse();

  const { id } = await context.params;
  const employee = await prisma.employee.findFirst({
    where: {
      id,
      // Dueño del negocio o admin
      ...(isAdmin(user.role) ? {} : { business: { ownerId: user.id } }),
    },
    include: { nfcTags: { where: { type: "employee_review" }, take: 1 } },
  });
  if (!employee) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

  const existing = employee.nfcTags[0];
  if (existing) return NextResponse.json({ token: existing.token });

  const tag = await prisma.nfcTag.create({
    data: {
      token: randomUUID(),
      label: `NFC de ${employee.name}`,
      type: "employee_review",
      businessId: employee.businessId,
      employeeId: employee.id,
    },
  });

  return NextResponse.json({ token: tag.token }, { status: 201 });
});
