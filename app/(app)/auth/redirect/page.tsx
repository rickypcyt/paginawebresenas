import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Destino post-login: decide a dónde va el usuario según el estado de su cuenta
export default async function AuthRedirectPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      createdAt: true,
      employee: { select: { id: true } },
      employeeJoinRequests: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { status: true },
      },
    },
  });

  if (!user) redirect("/");
  if (user.role === "admin") redirect("/admin");
  if (user.employee || user.role === "business") redirect("/dashboard");

  const latestRequest = user.employeeJoinRequests[0];
  const isNewAccount = Date.now() - user.createdAt.getTime() < 15 * 60 * 1000;

  // Cuenta recién creada (p. ej. primer login con Google) → onboarding de empresa
  if (isNewAccount || latestRequest?.status === "pending" || latestRequest?.status === "rejected") {
    redirect("/employee/join");
  }

  redirect("/dashboard");
}
