import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, withErrorHandler } from "@/lib/api-utils";

export const GET = withErrorHandler(async () => {
  const result = await requireAdmin();
  if ("error" in result) return result.error;

  const { user } = result.session;

  const [
    users,
    businesses,
    employees,
    tags,
    businessRequests,
    employeeJoinRequests,
    payments,
    categories,
    reviews,
    visits,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true } }, category: true },
    }),
    prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, email: true } }, business: { select: { id: true, name: true } } },
    }),
    prisma.nfcTag.findMany({
      orderBy: { createdAt: "desc" },
      include: { business: { select: { id: true, name: true } }, employee: { select: { id: true, name: true } } },
    }),
    prisma.businessRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: { requester: { select: { name: true, email: true } } },
    }),
    prisma.employeeJoinRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { name: true, email: true } },
        business: { select: { id: true, name: true } },
      },
    }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        business: { select: { id: true, name: true } },
        employee: { select: { id: true, name: true } },
      },
    }),
    prisma.visit.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: { business: { select: { id: true, name: true } } },
    }),
  ]);

  const data = {
    me: { name: user.name },
    db: {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
      businesses: businesses.map((b) => ({
        id: b.id,
        name: b.name,
        ownerId: b.ownerId,
        status: b.status,
        featured: b.featured,
        category: b.category?.name || null,
        city: b.city,
        address: b.address,
        phone: b.phone,
        website: b.website,
        instagram: b.instagram,
        googleReviewUrl: b.googleReviewUrl,
        hours: b.hours,
        description: b.description,
      })),
      employees: employees.map((e) => ({
        id: e.id,
        name: e.name,
        businessId: e.businessId,
        userId: e.userId,
        role: e.role,
        active: e.active,
      })),
      tags: tags.map((t) => ({
        id: t.id,
        label: t.label,
        type: t.type,
        businessId: t.businessId,
        emp: t.employeeId,
        active: t.active,
      })),
      requests: [
        ...businessRequests.map((r) => ({
          id: r.id,
          type: "business" as const,
          name: r.name,
          by: r.requester.name,
          email: r.requester.email,
          category: r.categoryName,
          city: r.city,
          address: r.address,
          when: r.createdAt,
        })),
        ...employeeJoinRequests.map((r) => ({
          id: r.id,
          type: "employee" as const,
          name: r.user.name,
          email: r.user.email,
          jobTitle: r.jobTitle,
          businessId: r.businessId,
          when: r.createdAt,
        })),
      ],
      payments: payments.map((p) => ({
        id: p.id,
        ref: p.reference,
        product: p.product,
        qty: p.quantity,
        amount: Number(p.amount),
        status: p.status,
        buyer: p.buyerName,
        email: p.buyerEmail,
        business: p.businessName,
        date: p.createdAt,
      })),
      categories: categories.map((c) => c.name),
    },
    reviews: reviews.map((r) => ({
      id: r.id,
      emp: r.employeeId,
      businessId: r.businessId,
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
  };

  return NextResponse.json(data);
});
