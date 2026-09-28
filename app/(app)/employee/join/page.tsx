import { redirect } from "next/navigation";
import { Clock3, ShieldCheck, XCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { JoinBusinessForm } from "@/components/employee/JoinBusinessForm";

export default async function EmployeeJoinPage() {
  const session = await getSession();
  if (!session?.user) redirect("/?redirect=/employee/join");

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (employee) redirect("/employee");

  const request = await prisma.employeeJoinRequest.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { business: { select: { name: true, city: true } } },
  });

  if (request?.status === "pending") {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-sm)]">
          <Clock3 className="mx-auto mb-4 h-12 w-12 text-[var(--warning)]" />
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Solicitud pendiente</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Nuestro equipo revisará tu solicitud para unirte a <strong className="text-[var(--foreground)]">{request.business.name}</strong>.</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Te mostraremos el acceso de empleado cuando sea aprobada.</p>
        </div>
      </main>
    );
  }

  const businesses = await prisma.business.findMany({
    where: { ownerId: { not: null } },
    select: { id: true, name: true, city: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 text-center">
        {request?.status === "rejected" ? <XCircle className="mx-auto mb-3 h-10 w-10 text-[var(--destructive)]" /> : <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[var(--primary-dark)]" />}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Únete a tu empresa</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {request?.status === "rejected" ? "Tu solicitud anterior fue rechazada. Puedes comprobar los datos y volver a enviarla." : "Busca el negocio donde trabajas. Nuestro equipo verificará tu solicitud antes de darte acceso."}
        </p>
      </div>
      <JoinBusinessForm businesses={businesses} />
    </main>
  );
}
