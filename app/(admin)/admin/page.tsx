import Link from "next/link";
import prisma from "@/lib/prisma";
import { Store, Users, Building2, Star, Tag, Tags, CreditCard, UserCog } from "lucide-react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { OfferCard } from "@/components/offers/OfferCard";
import { AdminEntityActions } from "@/components/admin/AdminEntityActions";
import { AdminCreateButton } from "@/components/admin/AdminCreateButton";
import { BusinessRequestActions } from "@/components/admin/BusinessRequestActions";
import { EmployeeJoinRequestActions } from "@/components/dashboard/EmployeeJoinRequestActions";
import { ShowMore } from "@/components/admin/ShowMore";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { VerifyButton } from "./businesses/VerifyButton";

const INITIAL = 5;

const STATUS_LABELS: Record<string, string> = {
  community: "👥 Comunidad",
  claim_pending: "⏳ Reclamación",
  verified: "✅ Verificado",
  premium: "💎 Premium",
};

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
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
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
  const [users, businesses, reviews, offers, categories, businessRequests, employeeJoinRequests, payments, employees] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        owner: { select: { id: true, name: true } },
        category: { select: { name: true } },
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
    prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { business: { select: { name: true, slug: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
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
        business: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const userOptions = [
    { value: "", label: "Sin asignar" },
    ...users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
  ];
  const businessOptions = businesses.map((b) => ({ value: b.id, label: b.name }));
  const categoryOptions = [
    { value: "", label: "Sin categoría" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

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

      {/* Solicitudes */}
      <Section icon={<Store className="h-5 w-5 text-[var(--primary-dark)]" />} title="Solicitudes pendientes" count={pendingCount}>
        {pendingCount === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No hay solicitudes pendientes.</p>
        ) : (
          <div className="space-y-3">
            {businessRequests.slice(0, INITIAL).map((request) => (
              <div key={request.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.name}</p>
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
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.user.name}</p>
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
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.name}</p>
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
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{request.user.name}</p>
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
              { name: "categoryId", label: "Categoría", type: "select", options: categoryOptions },
              { name: "ownerId", label: "Dueño (jefe)", type: "select", options: userOptions },
              { name: "city", label: "Ciudad" },
              { name: "address", label: "Dirección" },
              { name: "phone", label: "Teléfono" },
              {
                name: "status",
                label: "Estado",
                type: "select",
                options: [
                  { value: "community", label: "Comunidad" },
                  { value: "claim_pending", label: "Reclamación" },
                  { value: "verified", label: "Verificado" },
                  { value: "premium", label: "Premium" },
                ],
              },
              { name: "featured", label: "Destacado", type: "checkbox" },
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
        count={employees.length}
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
        {employees.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin empleados registrados.</p>
        ) : (
          <div className="space-y-3">
            {employees.slice(0, INITIAL).map((employee) => (
              <EmployeeRow key={employee.id} employee={employee} />
            ))}
            <ShowMore count={employees.length - INITIAL}>
              {employees.slice(INITIAL).map((employee) => (
                <div key={employee.id} className="mb-3">
                  <EmployeeRow employee={employee} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Usuarios */}
      <Section icon={<Users className="h-5 w-5 text-[var(--primary-dark)]" />} title="Usuarios" count={users.length}>
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

      {/* Campañas */}
      <Section icon={<Tag className="h-5 w-5 text-[var(--primary-dark)]" />} title="Campañas" count={offers.length}>
        {offers.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Sin ofertas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, INITIAL).map((offer) => (
              <div key={offer.id} className="space-y-2">
                <OfferCard offer={offer} />
                <OfferActions offer={offer} />
              </div>
            ))}
            <ShowMore count={offers.length - INITIAL}>
              {offers.slice(INITIAL).map((offer) => (
                <div key={offer.id} className="space-y-2">
                  <OfferCard offer={offer} />
                  <OfferActions offer={offer} />
                </div>
              ))}
            </ShowMore>
          </div>
        )}
      </Section>

      {/* Categorías */}
      <Section icon={<Tags className="h-5 w-5 text-[var(--primary-dark)]" />} title="Categorías" count={categories.length}>
        <CategoryForm />
        <div className="space-y-3">
          {categories.slice(0, INITIAL).map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  <span className="mr-2">{category.icon || "🏷️"}</span>{category.name}
                </p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{category.slug}</p>
              </div>
              <AdminEntityActions
                endpoint={`/api/admin/categories/${category.id}`}
                fields={[
                  { name: "name", label: "Nombre" },
                  { name: "slug", label: "Slug" },
                  { name: "icon", label: "Icono" },
                ]}
                values={{ name: category.name, slug: category.slug, icon: category.icon }}
                deleteConfirm={`¿Eliminar la categoría ${category.name}? Los negocios quedarán sin categoría.`}
              />
            </div>
          ))}
          <ShowMore count={categories.length - INITIAL}>
            {categories.slice(INITIAL).map((category) => (
              <div key={category.id} className="mb-3 flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    <span className="mr-2">{category.icon || "🏷️"}</span>{category.name}
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{category.slug}</p>
                </div>
                <AdminEntityActions
                  endpoint={`/api/admin/categories/${category.id}`}
                  fields={[
                    { name: "name", label: "Nombre" },
                    { name: "slug", label: "Slug" },
                    { name: "icon", label: "Icono" },
                  ]}
                  values={{ name: category.name, slug: category.slug, icon: category.icon }}
                  deleteConfirm={`¿Eliminar la categoría ${category.name}? Los negocios quedarán sin categoría.`}
                />
              </div>
            ))}
          </ShowMore>
        </div>
      </Section>
    </div>
  );
}

type BusinessRow = {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  status: string;
  featured: boolean;
  owner: { id: string; name: string } | null;
  category: { name: string } | null;
  _count: { reviews: number; employees: number; nfcTags: number };
};

function BusinessRow({ business, userOptions }: { business: BusinessRow; userOptions: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">{business.name}</p>
        <p className="truncate text-xs text-[var(--muted-foreground)]">
          {[business.category?.name, business.city].filter(Boolean).join(" · ") || "Sin datos"}
          {" · "}{STATUS_LABELS[business.status] ?? business.status}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
          {business.owner ? `Jefe: ${business.owner.name}` : "Sin dueño"}
          {" · "}{business._count.employees} empleados
          {" · "}{business._count.reviews} reseñas
          {" · "}{business._count.nfcTags} tags
        </p>
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
            { name: "city", label: "Ciudad" },
            { name: "address", label: "Dirección" },
            { name: "phone", label: "Teléfono" },
            {
              name: "status",
              label: "Estado",
              type: "select",
              options: [
                { value: "community", label: "Comunidad" },
                { value: "claim_pending", label: "Reclamación" },
                { value: "verified", label: "Verificado" },
                { value: "premium", label: "Premium" },
              ],
            },
            { name: "featured", label: "Destacado", type: "checkbox" },
          ]}
          values={{
            name: business.name,
            ownerId: business.owner?.id ?? "",
            city: business.city,
            address: business.address,
            phone: business.phone,
            status: business.status,
            featured: business.featured,
          }}
          deleteConfirm={`¿Eliminar ${business.name}? Se borrarán sus empleados, reseñas, tags NFC, ofertas y visitas.`}
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
          deleteConfirm={`¿Eliminar al usuario ${user.name}? Se borrarán sus reseñas, visitas y datos asociados.`}
        />
      </div>
    </div>
  );
}

type EmployeeRowData = {
  id: string;
  name: string;
  role: string | null;
  active: boolean;
  business: { name: string };
  user: { name: string; email: string } | null;
};

function EmployeeRow({ employee }: { employee: EmployeeRowData }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
          {employee.name}
          {employee.role && <span className="ml-2 font-normal text-[var(--muted-foreground)]">{employee.role}</span>}
          {!employee.active && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Inactivo</span>}
        </p>
        <p className="truncate text-xs text-[var(--muted-foreground)]">
          {employee.business.name}
          {employee.user ? ` · ${employee.user.name} (${employee.user.email})` : " · Sin usuario vinculado"}
        </p>
      </div>
      <div className="shrink-0">
        <AdminEntityActions
          endpoint={`/api/admin/employees/${employee.id}`}
          fields={[
            { name: "name", label: "Nombre" },
            { name: "role", label: "Cargo" },
            { name: "active", label: "Activo", type: "checkbox" },
          ]}
          values={{ name: employee.name, role: employee.role, active: employee.active }}
          deleteConfirm={`¿Eliminar al empleado ${employee.name}?`}
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
      deleteConfirm="¿Eliminar esta reseña?"
    />
  );
}

type OfferRow = {
  id: string;
  title: string;
  description: string | null;
  conditions: string | null;
  featured: boolean;
};

function OfferActions({ offer }: { offer: OfferRow }) {
  return (
    <AdminEntityActions
      endpoint={`/api/admin/offers/${offer.id}`}
      fields={[
        { name: "title", label: "Título" },
        { name: "description", label: "Descripción", type: "textarea" },
        { name: "conditions", label: "Condiciones" },
        { name: "featured", label: "Destacada", type: "checkbox" },
      ]}
      values={{ title: offer.title, description: offer.description, conditions: offer.conditions, featured: offer.featured }}
      deleteConfirm={`¿Eliminar la oferta "${offer.title}"?`}
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
      </div>
    </div>
  );
}
