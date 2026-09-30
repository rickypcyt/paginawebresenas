import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, withErrorHandler } from "@/lib/api-utils";

const ROLES = ["user", "employee", "business", "admin"];

export const POST = withErrorHandler(async (request: Request) => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = ROLES.includes(body.role) ? body.role : "user";

  if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  if (password.length < 4) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 4 caracteres" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });
  }

  const { user } = await auth.api.signUpEmail({ body: { name, email, password } });
  if (role !== "user") {
    await prisma.user.update({ where: { id: user.id }, data: { role } });
  }

  return NextResponse.json({ user: { ...user, role } }, { status: 201 });
});
