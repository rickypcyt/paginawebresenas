import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler } from "@/lib/api-utils";
import { isBusiness, isAdmin } from "@/lib/roles";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const GET = withErrorHandler(async (request: Request) => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  if (!isBusiness(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  const where = isAdmin(user.role)
    ? businessId
      ? { id: businessId }
      : {}
    : { ownerId: user.id };

  const businesses = await prisma.business.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  if (businesses.length === 0) {
    return NextResponse.json({ error: "No tienes negocios" }, { status: 404 });
  }

  const selectedId =
    businessId && businesses.some((b) => b.id === businessId)
      ? businessId
      : businesses[0].id;

  const [business, joinRequests, reviews, visits] = await Promise.all([
    prisma.business.findUnique({
      where: { id: selectedId },
      include: {
        category: true,
        owner: { select: { id: true, name: true, email: true } },
        employees: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, email: true } },
            nfcTags: { where: { type: "employee_review" }, take: 1, select: { token: true } },
          },
        },
        nfcTags: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.employeeJoinRequest.findMany({
      where: { businessId: selectedId, status: "pending" },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.review.findMany({
      where: { businessId: selectedId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        employee: { select: { id: true, name: true } },
      },
    }),
    prisma.visit.findMany({
      where: { businessId: selectedId },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  ]);

  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const nfcUrl = (token: string) => `${APP_URL}/nfc/${token}`;

  const data = {
    owner: {
      id: business.owner?.id || user.id,
      name: business.owner?.name || user.name,
      email: business.owner?.email || user.email,
    },
    business: {
      id: business.id,
      name: business.name,
      category: business.category?.name || null,
      description: business.description,
      address: business.address,
      city: business.city,
      phone: business.phone,
      hours: business.hours,
      website: business.website,
      instagram: business.instagram,
      googleReviewUrl: business.googleReviewUrl,
      status: business.status,
      logoUrl: business.imageUrl,
    },
    employees: business.employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      email: e.user?.email || null,
      active: e.active,
      nfcUrl: e.nfcTags[0] ? nfcUrl(e.nfcTags[0].token) : null,
    })),
    joinRequests: joinRequests.map((r) => ({
      id: r.id,
      name: r.user.name,
      email: r.user.email,
      jobTitle: r.jobTitle,
      when: r.createdAt,
    })),
    reviews: reviews.map((r) => ({
      id: r.id,
      emp: r.employeeId,
      rating: r.rating,
      chips: [],
      msg: r.content,
      client: r.user?.name || r.guestName || "Anónimo",
      date: r.createdAt,
    })),
    taps: visits.map((v) => ({
      tag: v.businessId,
      date: v.createdAt,
    })),
    tags: business.nfcTags.map((t) => ({
      id: t.id,
      label: t.label,
      type: t.type,
      emp: t.employeeId,
    })),
  };

  return NextResponse.json(data);
});
