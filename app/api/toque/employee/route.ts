import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSession, withErrorHandler } from "@/lib/api-utils";
import { isEmployee } from "@/lib/roles";

export const GET = withErrorHandler(async () => {
  const result = await requireSession();
  if ("error" in result) return result.error;

  const { user } = result.session;
  if (!isEmployee(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

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

  if (!employee) {
    return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  }

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

  const data = {
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

  return NextResponse.json(data);
});
