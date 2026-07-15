import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "admin" },
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json({
    message: "Ahora eres admin",
    user: updated,
  });
}
