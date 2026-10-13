import prisma from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/api-utils";
import { isAdmin, isBusiness, isEmployee } from "@/lib/roles";

export async function getAdminData() {
  const result = await requireAdmin();
  if ("error" in result) return null;

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
      include: {
        user: { select: { id: true, email: true } },
        business: { select: { id: true, name: true } },
      },
    }),
    prisma.nfcTag.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        business: { select: { id: true, name: true } },
        employee: { select: { id: true, name: true } },
      },
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

  return {
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
      chips: [] as string[],
      msg: r.content,
      client: r.user?.name || r.guestName || "Anónimo",
      date: r.createdAt,
    })),
    taps: visits.map((v) => ({
      tag: v.businessId,
      date: v.createdAt,
    })),
  };
}

export async function getOwnerData(businessId?: string) {
  const result = await requireSession();
  if ("error" in result) return null;

  const { user } = result.session;
  if (!isBusiness(user.role)) return null;

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

  if (businesses.length === 0) return null;

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

  if (!business) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const nfcUrl = (token: string) => `${appUrl}/nfc/${token}`;

  return {
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
      chips: [] as string[],
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
}

export async function getEmployeeData() {
  const result = await requireSession();
  if ("error" in result) return null;

  const { user } = result.session;
  if (!isEmployee(user.role)) return null;

  const employee = await prisma.employee.findUnique({
    where: { userId: user.id },
    include: {
      business: {
        include: {
          employees: {
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, role: true },
          },
        },
      },
    },
  });

  if (!employee) return null;

  const teamIds = employee.business.employees.map((e) => e.id);

  const [myReviews, teamReviews] = await Promise.all([
    prisma.review.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.review.findMany({
      where: { employeeId: { in: teamIds }, NOT: { employeeId: employee.id } },
      orderBy: { createdAt: "desc" },
      select: { id: true, employeeId: true, rating: true, createdAt: true },
    }),
  ]);

  return {
    me: {
      id: employee.id,
      name: employee.name,
      role: employee.role,
    },
    business: {
      name: employee.business.name,
    },
    team: employee.business.employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
    })),
    reviews: [
      ...myReviews.map((r) => ({
        id: r.id,
        emp: r.employeeId,
        rating: r.rating,
        chips: [] as string[],
        msg: r.content,
        client: r.user?.name || r.guestName || "Anónimo",
        date: r.createdAt,
      })),
      ...teamReviews.map((r) => ({
        id: r.id,
        emp: r.employeeId,
        rating: r.rating,
        chips: [] as string[],
        msg: null as string | null,
        client: null as string | null,
        date: r.createdAt,
      })),
    ],
  };
}
