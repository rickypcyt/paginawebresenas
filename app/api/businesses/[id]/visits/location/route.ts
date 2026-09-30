import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isWithinRadius } from "@/lib/verification";
import { requireSession, withErrorHandler, rateLimit, rateLimitResponse, RouteContext } from "@/lib/api-utils";

const RECENT_VISIT_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 h

export const POST = withErrorHandler(async (
  request: Request,
  { params }: RouteContext<{ id: string }>
) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  const { id } = await params;

  if (!rateLimit(`visit-location:${user.id}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  const body = await request.json();
  const latitude = typeof body.latitude === "number" ? body.latitude : null;
  const longitude = typeof body.longitude === "number" ? body.longitude : null;

  const coordsValid =
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;

  if (!coordsValid) {
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

  // Idempotente: una visita reciente del mismo usuario al mismo negocio no se duplica.
  const recent = await prisma.visit.findFirst({
    where: {
      userId: user.id,
      businessId: id,
      createdAt: { gte: new Date(Date.now() - RECENT_VISIT_WINDOW_MS) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return NextResponse.json({ visit: recent, message: "Visita ya registrada" });
  }

  const visit = await prisma.visit.create({
    data: {
      userId: user.id,
      businessId: id,
      latitude,
      longitude,
      verification: "location",
    },
  });

  return NextResponse.json({ visit, message: "Visita verificada por ubicación" });
});
