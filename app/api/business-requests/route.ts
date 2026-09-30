import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse } from "@/lib/api-utils";

export const GET = withErrorHandler(async () => {
  // Requiere sesión: la lista expone nombres de solicitantes y apoyos.
  const result = await requireSession();
  if ("error" in result) return result.error;
  const userId = result.session.user.id;

  const requests = await prisma.businessRequest.findMany({
    where: { status: { not: "rejected" } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      categoryName: true,
      description: true,
      status: true,
      createdAt: true,
      _count: { select: { supporters: true } },
      requester: { select: { name: true } },
      // Solo el userId del propio usuario — suficiente para marcar "apoyado".
      supporters: { where: { userId }, select: { userId: true } },
    },
  });

  return NextResponse.json({ requests });
});

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;

  if (!rateLimit(`create-request:${user.id}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";

  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  // Evita solicitudes duplicadas del mismo negocio aún pendientes.
  const duplicate = await prisma.businessRequest.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      status: { in: ["pending", "invited"] },
    },
    select: { id: true },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "Ya existe una solicitud pendiente para ese negocio" },
      { status: 409 }
    );
  }

  const businessRequest = await prisma.businessRequest.create({
    data: {
      name,
      address: typeof body.address === "string" ? body.address.trim().slice(0, 200) || null : null,
      city: typeof body.city === "string" ? body.city.trim().slice(0, 80) || null : null,
      categoryId: typeof body.categoryId === "string" ? body.categoryId || null : null,
      categoryName: typeof body.categoryName === "string" ? body.categoryName.trim().slice(0, 80) || null : null,
      description: typeof body.description === "string" ? body.description.trim().slice(0, 1000) || null : null,
      requesterId: user.id,
    },
  });

  return NextResponse.json({ businessRequest });
});
