import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { isWithinRadius } from "@/lib/verification";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const { latitude, longitude } = await request.json();

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Coordenadas inválidas" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id },
    select: { latitude: true, longitude: true, name: true },
  });

  if (!business || !business.latitude || !business.longitude) {
    return NextResponse.json({ error: "Negocio sin ubicación" }, { status: 400 });
  }

  if (!isWithinRadius(latitude, longitude, business.latitude, business.longitude)) {
    return NextResponse.json(
      { error: "No estás dentro del radio permitido (50 m)" },
      { status: 403 }
    );
  }

  const visit = await prisma.visit.create({
    data: {
      userId: session.user.id,
      businessId: id,
      latitude,
      longitude,
      verification: "location",
    },
  });

  return NextResponse.json({ visit, message: "Visita verificada por ubicación" });
}
