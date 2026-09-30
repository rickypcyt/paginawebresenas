import Link from "next/link";
import prisma from "@/lib/prisma";
import { Store, Users, Building2, Star, CreditCard, UserCog } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminEmployeeList } from "@/components/admin/AdminEmployeeList";
import { AdminCreateButton } from "@/components/admin/AdminCreateButton";
import { BusinessRequestActions } from "@/components/admin/BusinessRequestActions";
import { EmployeeJoinRequestActions } from "@/components/dashboard/EmployeeJoinRequestActions";
import { ShowMore } from "@/components/admin/ShowMore";
import { VerifyButton } from "./businesses/VerifyButton";

const INITIAL = 5;

const PAYMENT_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Aprobado", className: "bg-green-50 text-green-700" },
  rejected: { label: "Rechazado", className: "bg-red-50 text-red-700" },
  expired: { label: "Expirado", className: "bg-gray-100 text-gray-600" },
  failed: { label: "Fallido", className: "bg-red-50 text-red-700" },
};

const PAYMENT_PRODUCT_LABELS: Record<string, string> = {
  tag_a: "Tag Tipo A",
  plan_starter: "Plan Starter",
  plan_business: "Plan Negocio",
  plan_business_plus: "Plan Negocio Plus",
  plan_enterprise: "Plan Empresarial",
};

function Section({
  icon,
  title,
  count,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
        <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-semibold text-[var(--primary-dark)]">{count}</span>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export default async function AdminDashboardPage() {
  const [users, businesses, reviews, businessRequests, employeeJoinRequests, payments, employees] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { employee: { select: { id: true } } },
    }),
    prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        owner: { select: { id: true, name: true } },
        _count: { select: { reviews: true, employees: true, nfcTags: true } },
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        user: { select: { name: true, image: true } },
        business: { select: { name: true } },
      },
    }),
    prisma.businessRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        requester: { select: { name: true, email: true } },
        _count: { select: { supporters: true } },
      },
    }),
    prisma.employeeJoinRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { name: true, email: true } },
        business: { select: { name: true } },
      },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        business: { select: { id: true, name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const userOptions = [
    { value: "", label: "Sin asignar" },
    ...users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
  ];
  const businessOptions = businesses.map((b) => ({ value: b.id, label: b.name }));

  // Usuarios con rol employee que aún no tienen ficha de empleado en ningún negocio
  const unassignedEmployees = users
    .filter((u) => u.role === "employee" && !u.employee)
    .map((u) => ({ id: u.id, name: u.name, email: u.email }));

  const pendingCount = businessRequests.length + employeeJoinRequests.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <p className="text-sm font-medium text-[var(--primary-dark)]">Panel de administración</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Toda la plataforma</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {[
          { label: "Usuarios", value: users.length },
          { label: "Negocios", value: businesses.length },
          { label: "Empleados", value: employees.length },
          { label: "Reseñas", value: reviews.length },
          { label: "Pagos", value: payments.length },
          { label: "Pendientes", value: pendingCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
      {/* Solicitudes */}
      <Section icon={<Store className="h-5 w-5 text-[var(--primary-dark)]" />} title="Solicitudes pendientes" count={pendingCount}>
        {pendingCount === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No hay solicitudes pendientes.</p>
        ) : (
          <div className="space-y-3">
            {businessRequests.slice(0, INITIAL).map((request) => (
              <div key={request.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {request.name}
                    <span className="ml-2 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary-dark)]">Nuevo negocio</span>
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {[request.categoryName, request.city, request.address].filter(Boolean).join(" · ") || "Sin datos"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Solicita: {request.requester.name} ({request.requester.email}) · {request._count.supporters} apoyos
                  </p>
                </div>
                <BusinessRequestActions requestId={request.id} />
              </div>
            ))}
            {employeeJoinRequests.slice(0, INITIAL).map((request) => (
              <div key={request.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {request.user.name}
                    <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Quiere ser empleado</span>
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {request.user.email} · {request.business.name}{request.jobTitle ? ` · ${request.jobTitle}` : ""}
                  </p>
                </div>
                <EmployeeJoinRequestActions requestId={request.id} />
              </div>
            ))}
            <ShowMore count={Math.max(0, businessRequests.length - INITIAL) + Math.max(0, employeeJoinRequests.length - INITIAL)}>
              {businessRequests.slice(INITIAL).map((request) => (
                <div key={request.id} className="mb-3 flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {request.name}
                      <span className="ml-2 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--primary-dark)]">Nuevo negocio</span>
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Solicita: {request.requester.name} ({request.requester.email})
                    </p>
                  </div>
                  <BusinessRequestActions requestId={request.id} />
                </div>
              ))}
              {employeeJoinRequests.slice(INITIAL).map((request) => (
                <div key={request.id} className="mb-3 flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {request.user.name}
                      <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Quiere ser empleado</span>
                    </p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {request.user.email} · {request.business.name}
                    </p>
                  </div>
                  <EmployeeJoinRequestActions requestId={request.id} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Usuarios */}
      <Section
        icon={<Users className="h-5 w-5 text-[var(--primary-dark)]" />}
        title="Usuarios"
        count={users.length}
        action={
          <AdminCreateButton
            endpoint="/api/admin/users"
            label="Nuevo usuario"
            fields={[
              { name: "name", label: "Nombre" },
              { name: "email", label: "Email" },
              { name: "password", label: "Contraseña", type: "password" },
              {
                name: "role",
                label: "Rol",
                type: "select",
                options: [
                  { value: "user", label: "Usuario" },
                  { value: "employee", label: "Empleado" },
                  { value: "business", label: "Negocio" },
                  { value: "admin", label: "Admin" },
                ],
              },
            ]}
          />
        }
      >
        {users.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin usuarios.</p>
        ) : (
          <div className="space-y-3">
            {users.slice(0, INITIAL).map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            <ShowMore count={users.length - INITIAL}>
              {users.slice(INITIAL).map((user) => (
                <div key={user.id} className="mb-3">
                  <UserRow user={user} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Negocios */}
      <Section
        icon={<Building2 className="h-5 w-5 text-[var(--primary-dark)]" />}
        title="Negocios"
        count={businesses.length}
        action={
          <AdminCreateButton
            endpoint="/api/admin/businesses"
            label="Nuevo negocio"
            fields={[
              { name: "name", label: "Nombre del negocio" },
              { name: "ownerId", label: "Dueño (jefe)", type: "select", options: userOptions },
              { name: "imageUrl", label: "Logo", type: "image" },
            ]}
          />
        }
      >
        {businesses.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin negocios registrados.</p>
        ) : (
          <div className="space-y-3">
            {businesses.slice(0, INITIAL).map((business) => (
              <BusinessRow key={business.id} business={business} userOptions={userOptions} />
            ))}
            <ShowMore count={businesses.length - INITIAL}>
              {businesses.slice(INITIAL).map((business) => (
                <div key={business.id} className="mb-3">
                  <BusinessRow business={business} userOptions={userOptions} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Equipo */}
      <Section
        icon={<UserCog className="h-5 w-5 text-[var(--primary-dark)]" />}
        title="Empleados"
        count={employees.length + unassignedEmployees.length}
        action={
          <AdminCreateButton
            endpoint="/api/admin/employees"
            label="Añadir empleado"
            fields={[
              { name: "name", label: "Nombre del empleado" },
              { name: "businessId", label: "Negocio", type: "select", options: businessOptions },
              { name: "userId", label: "Usuario vinculado", type: "select", options: userOptions },
              { name: "role", label: "Cargo (ej. Mesero, Cajero)" },
              { name: "active", label: "Activo", type: "checkbox" },
            ]}
          />
        }
      >
        {employees.length === 0 && unassignedEmployees.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin empleados registrados.</p>
        ) : (
          <AdminEmployeeList
            employees={employees}
            businesses={businesses}
            unassigned={unassignedEmployees}
          />
        )}
      </Section>

      {/* Reseñas */}
      <Section icon={<Star className="h-5 w-5 text-[var(--primary-dark)]" />} title="Reseñas" count={reviews.length}>
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin reseñas.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.slice(0, INITIAL).map((review) => (
              <div key={review.id} className="space-y-2">
                <ReviewCard review={review} />
                <ReviewActions review={review} />
              </div>
            ))}
            <ShowMore count={reviews.length - INITIAL}>
              {reviews.slice(INITIAL).map((review) => (
                <div key={review.id} className="space-y-2">
                  <ReviewCard review={review} />
                  <ReviewActions review={review} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Pagos */}
      <Section icon={<CreditCard className="h-5 w-5 text-[var(--primary-dark)]" />} title="Pagos" count={payments.length}>
        {payments.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin pagos registrados.</p>
        ) : (
          <div className="space-y-3">
            {payments.slice(0, INITIAL).map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
            <ShowMore count={payments.length - INITIAL}>
              {payments.slice(INITIAL).map((payment) => (
                <div key={payment.id} className="mb-3">
                  <PaymentRow payment={payment} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>
      </div>

    </div>
  );
}

type BusinessRow = {
  id: string;
  name: string;
  status: string;
  owner: { id: string; name: string } | null;
  imageUrl: string | null;
  _count: { reviews: number; employees: number; nfcTags: number };
};

function BusinessRow({ business, userOptions }: { business: BusinessRow; userOptions: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        {business.imageUrl ? (
          <img src={business.imageUrl} alt={business.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-lg">🏪</span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">{business.name}</p>
          <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
          {business.owner ? `Jefe: ${business.owner.name}` : "Sin dueño"}
          {" · "}{business._count.employees} empleados
          {" · "}{business._count.reviews} reseñas
          {" · "}{business._count.nfcTags} tags
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {business.status === "claim_pending" && <VerifyButton id={business.id} />}
        <Link href={`/admin/businesses/${business.id}`} className="text-xs font-medium text-[var(--primary-dark)] hover:underline">
          Gestionar
        </Link>
        <AdminEntityActions
          endpoint={`/api/admin/businesses/${business.id}`}
          fields={[
            { name: "name", label: "Nombre" },
            { name: "ownerId", label: "Dueño (jefe)", type: "select", options: userOptions },
            { name: "imageUrl", label: "Logo", type: "image" },
          ]}
          values={{
            name: business.name,
            ownerId: business.owner?.id ?? "",
            imageUrl: business.imageUrl,
          }}
        />
      </div>
    </div>
  );
}

type UserRow = { id: string; name: string; email: string; role: string };

function UserRow({ user }: { user: UserRow }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
        <p className="truncate text-xs text-[var(--muted-foreground)]">
          {user.email} · <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-[var(--accent-foreground)]">{user.role}</span>
        </p>
      </div>
      <div className="shrink-0">
        <AdminEntityActions
          endpoint={`/api/admin/users/${user.id}`}
          fields={[
            { name: "name", label: "Nombre" },
            { name: "email", label: "Email" },
            {
              name: "role",
              label: "Rol",
              type: "select",
              options: [
                { value: "user", label: "Usuario" },
                { value: "employee", label: "Empleado" },
                { value: "business", label: "Negocio" },
                { value: "admin", label: "Admin" },
              ],
            },
          ]}
          values={{ name: user.name, email: user.email, role: user.role }}
        />
      </div>
    </div>
  );
}

type ReviewRow = { id: string; title: string; content: string; rating: number };

function ReviewActions({ review }: { review: ReviewRow }) {
  return (
    <AdminEntityActions
      endpoint={`/api/admin/reviews/${review.id}`}
      fields={[
        { name: "title", label: "Título" },
        { name: "content", label: "Contenido", type: "textarea" },
        { name: "rating", label: "Puntuación (1-5)", type: "number" },
      ]}
      values={{ title: review.title, content: review.content, rating: review.rating }}
    />
  );
}

type PaymentRowData = {
  id: string;
  reference: string;
  product: string;
  amount: unknown;
  currency: string;
  status: string;
  buyerName: string;
  buyerEmail: string;
  businessName: string;
  createdAt: Date;
};

function PaymentRow({ payment }: { payment: PaymentRowData }) {
  const status = PAYMENT_STATUS_LABELS[payment.status] ?? PAYMENT_STATUS_LABELS.pending;
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
          {payment.businessName} · {PAYMENT_PRODUCT_LABELS[payment.product] ?? payment.product}
        </p>
        <p className="truncate text-xs text-[var(--muted-foreground)]">
          {payment.buyerName} ({payment.buyerEmail}) · <span className="font-mono">{payment.reference}</span> · {payment.createdAt.toLocaleDateString("es")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-bold text-[var(--foreground)]">
          ${Number(payment.amount).toFixed(2)}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
          {status.label}
        </span>
        {(payment.status === "pending" || payment.status === "approved") && (
          <AdminDeleteButton endpoint={`/api/admin/payments/${payment.id}`} />
        )}
      </div>
    </div>
  );
}
