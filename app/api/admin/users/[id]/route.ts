import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler, RouteContext } from "@/lib/api-utils";

const ROLES = ["user", "employee", "business", "admin"];

type Ctx = RouteContext<{ id: string }>;

export const PATCH = withErrorHandler(async (request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.email === "string" && body.email.includes("@")) data.email = body.email.trim();
  if (typeof body.role === "string" && ROLES.includes(body.role)) {
    if (id === result.session.user.id && body.role !== "admin") {
      return NextResponse.json(
        { error: "No puedes cambiar tu propio rol de admin" },
        { status: 400 }
      );
    }
    // Evita dejar la plataforma sin administradores.
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (target?.role === "admin" && body.role !== "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "No puedes quitar el último admin" },
          { status: 400 }
        );
      }
    }
    data.role = body.role;
  }

  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ user });
});

export const DELETE = withErrorHandler(async (_request: Request, { params }: Ctx) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { id } = await params;
  if (id === result.session.user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
