import { randomUUID } from "node:crypto";
import prisma from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/slug";

const DEMO_AUTHORS = [
  { email: "lucia@toque.test", name: "Lucía Mendoza" },
  { email: "pedro@toque.test", name: "Pedro Álvarez" },
  { email: "sofia@toque.test", name: "Sofía Ramírez" },
  { email: "diego@toque.test", name: "Diego Castro" },
];

const REVIEW_SAMPLES = [
  { title: "Atención excelente", rating: 5, content: "Me atendieron rápido y con muy buena actitud. Volveré seguro." },
  { title: "Muy buen servicio", rating: 4, content: "Todo bien, el pedido llegó a tiempo y el personal fue amable." },
  { title: "Podría mejorar", rating: 3, content: "La comida bien, pero la espera fue más larga de lo esperado." },
  { title: "Gran experiencia", rating: 5, content: "De lo mejor de la zona, ambiente agradable y precios justos." },
  { title: "Atención regular", rating: 2, content: "Tardaron en tomar el pedido y se equivocaron con la cuenta." },
  { title: "Recomendado", rating: 4, content: "Buena relación calidad-precio, ideal para ir con amigos." },
];

const EMPLOYEE_SAMPLES = [
  { name: "María González", role: "Mesera" },
  { name: "Carlos Rivera", role: "Barista" },
  { name: "Ana Torres", role: "Caja" },
];

function daysAgo(n: number, jitter = 0) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000 - jitter * 60 * 60 * 1000);
}

async function ensureUser(email: string, name: string, role: "user" | "business" = "user") {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.user.create({
    data: { id: randomUUID(), name, email, emailVerified: true, role },
  });
}

async function uniqueSlug(name: string) {
  const rows = await prisma.business.findMany({
    where: { slug: { startsWith: slugify(name) } },
    select: { slug: true },
  });
  return generateUniqueSlug(name, rows.map((r) => r.slug));
}

async function ensureBusiness(name: string, ownerId: string | null) {
  const existing = await prisma.business.findFirst({
    where: { name, ...(ownerId ? { ownerId } : {}) },
  });
  if (existing) return existing;

  const category = await prisma.category.upsert({
    where: { slug: "cafeterias" },
    update: {},
    create: { name: "Cafeterías", slug: "cafeterias", icon: "☕" },
  });

  return prisma.business.create({
    data: {
      name,
      slug: await uniqueSlug(name),
      ownerId,
      categoryId: category.id,
      city: "Guayaquil",
      address: "Av. Demo 123 y Los Robles",
      description: "Negocio de prueba generado en modo desarrollo.",
      hours: "Lun-Dom 9:00-21:00",
      status: "verified",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop",
      latitude: -2.1894,
      longitude: -79.8891,
    },
  });
}

async function ensureTags(businessId: string) {
  const tags = await prisma.nfcTag.findMany({ where: { businessId } });
  let general = tags.find((t) => t.type === "business_google");
  if (!general) {
    general = await prisma.nfcTag.create({
      data: {
        token: randomUUID(),
        label: "NFC reseñas de Google",
        type: "business_google",
        businessId,
      },
    });
  }
  return { all: tags, general };
}

async function ensureEmployees(businessId: string) {
  const employees = [];
  for (const e of EMPLOYEE_SAMPLES) {
    let employee = await prisma.employee.findFirst({
      where: { businessId, name: e.name },
    });
    employee ??= await prisma.employee.create({
      data: { name: e.name, role: e.role, businessId },
    });
    employees.push(employee);

    const hasTag = await prisma.nfcTag.findFirst({
      where: { employeeId: employee.id, type: "employee_review" },
    });
    if (!hasTag) {
      await prisma.nfcTag.create({
        data: {
          token: randomUUID(),
          label: `NFC de ${employee.name}`,
          type: "employee_review",
          businessId,
          employeeId: employee.id,
        },
      });
    }
  }
  return employees;
}

async function ensureInternalReviews(
  businessId: string,
  employeeIds: string[],
  authorIds: string[]
) {
  for (const [index, employeeId] of employeeIds.entries()) {
    const count = await prisma.review.count({ where: { employeeId } });
    if (count > 0) continue;
    await prisma.review.createMany({
      data: Array.from({ length: 6 }, (_, i) => {
        const sample = REVIEW_SAMPLES[(index + i) % REVIEW_SAMPLES.length];
        return {
          title: sample.title,
          content: sample.content,
          rating: sample.rating,
          verification: "nfc" as const,
          userId: authorIds[(index + i) % authorIds.length],
          businessId,
          employeeId,
          // spread across ~55 days so every period filter has data
          createdAt: daysAgo(i * 9 + (index % 3), i),
        };
      }),
    });
  }
}

async function ensureBusinessReviews(businessId: string, authorIds: string[]) {
  const count = await prisma.review.count({
    where: { businessId, employeeId: null },
  });
  if (count > 0) return;
  await prisma.review.createMany({
    data: REVIEW_SAMPLES.map((sample, i) => ({
      title: sample.title,
      content: sample.content,
      rating: sample.rating,
      verification: i % 2 === 0 ? ("qr" as const) : ("location" as const),
      userId: authorIds[i % authorIds.length],
      businessId,
      createdAt: daysAgo(i * 7, i * 2),
    })),
  });
}

async function ensureVisits(businessId: string, userIds: string[]) {
  const count = await prisma.visit.count({ where: { businessId } });
  if (count > 0) return;
  const tags = await prisma.nfcTag.findMany({
    where: { businessId },
    select: { token: true, type: true },
  });
  const tokens = tags.length > 0 ? tags.map((t) => t.token) : [null];
  await prisma.visit.createMany({
    data: Array.from({ length: 14 }, (_, i) => ({
      userId: userIds[i % userIds.length],
      businessId,
      verification: "nfc" as const,
      token: tokens[i % tokens.length],
      createdAt: daysAgo(i * 4, i * 3),
    })),
  });
}

async function ensureOffers(businessId: string) {
  const count = await prisma.offer.count({ where: { businessId } });
  if (count > 0) return;
  await prisma.offer.createMany({
    data: [
      {
        title: "2x1 en capuchinos",
        description: "Todos los martes por la tarde.",
        discountType: "bogo",
        featured: true,
        businessId,
        endDate: daysAgo(-30),
      },
      {
        title: "10% de descuento",
        description: "Mostrando tu reseña Toque en caja.",
        discountType: "percentage",
        discountValue: 10,
        businessId,
        endDate: daysAgo(-60),
      },
    ],
  });
}

async function ensureCustomerActivity(userId: string, businessIds: string[]) {
  const authored = await prisma.review.count({ where: { userId } });
  if (authored < 3 && businessIds.length > 0) {
    await prisma.review.createMany({
      data: REVIEW_SAMPLES.slice(0, 4).map((sample, i) => ({
        title: sample.title,
        content: sample.content,
        rating: sample.rating,
        verification: "qr" as const,
        userId,
        businessId: businessIds[i % businessIds.length],
        createdAt: daysAgo(i * 6, i),
      })),
    });
  }

  const favCount = await prisma.favorite.count({ where: { userId } });
  if (favCount === 0) {
    for (const businessId of businessIds.slice(0, 2)) {
      await prisma.favorite.upsert({
        where: { userId_businessId: { userId, businessId } },
        update: {},
        create: { userId, businessId },
      });
    }
  }

  const badge = await prisma.badge.upsert({
    where: { slug: "first-review" },
    update: {},
    create: {
      slug: "first-review",
      name: "Primera reseña",
      icon: "⭐",
      description: "Publicaste tu primera reseña",
    },
  });
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id },
  });
}

/**
 * Idempotente: solo crea lo que falte. Pensado para /api/dev/seed.
 * Devuelve una lista de cosas sembradas para mostrar en la UI.
 */
export async function seedDemoDataForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true },
  });
  if (!user) throw new Error("Usuario no encontrado");

  const done: string[] = [];
  const authors = await Promise.all(
    DEMO_AUTHORS.map((a) => ensureUser(a.email, a.name))
  );
  const authorIds = authors.map((a) => a.id);

  // Negocio compartido que usan empleados y clientes
  const owner = await ensureUser("jefe@toque.test", "Jefe Demo", "business");
  const shared = await ensureBusiness("Café Demo", owner.id);
  await ensureTags(shared.id);
  const sharedEmployees = await ensureEmployees(shared.id);
  await ensureInternalReviews(
    shared.id,
    sharedEmployees.map((e) => e.id),
    authorIds
  );
  await ensureBusinessReviews(shared.id, authorIds);
  await ensureVisits(shared.id, [...authorIds, user.id]);
  done.push(`negocio "${shared.name}" con ${sharedEmployees.length} empleados, tags y reseñas`);

  // Rol empleado: vincular Employee al usuario dentro de Café Demo
  if (user.role === "employee") {
    let employee = await prisma.employee.findUnique({ where: { userId: user.id } });
    employee ??= await prisma.employee.create({
      data: {
        userId: user.id,
        businessId: shared.id,
        name: user.name || "Empleado Demo",
        role: "Demo",
      },
    });
    const hasTag = await prisma.nfcTag.findFirst({
      where: { employeeId: employee.id, type: "employee_review" },
    });
    if (!hasTag) {
      await prisma.nfcTag.create({
        data: {
          token: randomUUID(),
          label: `NFC de ${employee.name}`,
          type: "employee_review",
          businessId: shared.id,
          employeeId: employee.id,
        },
      });
    }
    await ensureInternalReviews(shared.id, [employee.id], authorIds);
    done.push(`ficha de empleado "${employee.name}" con reseñas recibidas`);
  }

  // Rol negocio/admin: negocio propio con todo el panel poblado
  if (user.role === "business" || user.role === "admin") {
    const own = await ensureBusiness(`El Rincón de ${user.name || "Demo"}`, user.id);
    await ensureTags(own.id);
    const ownEmployees = await ensureEmployees(own.id);
    await ensureInternalReviews(
      own.id,
      ownEmployees.map((e) => e.id),
      authorIds
    );
    await ensureBusinessReviews(own.id, authorIds);
    await ensureVisits(own.id, authorIds);
    await ensureOffers(own.id);
    // seguidores para que los contadores no salgan en cero
    for (const authorId of authorIds) {
      await prisma.follower.upsert({
        where: { userId_businessId: { userId: authorId, businessId: own.id } },
        update: {},
        create: { userId: authorId, businessId: own.id },
      });
    }
    done.push(`negocio propio "${own.name}" con equipo, ofertas y actividad`);
  }

  // Actividad como cliente: reseñas propias, favoritos, insignia
  const businessIds = (
    await prisma.business.findMany({ take: 4, select: { id: true } })
  ).map((b) => b.id);
  await ensureCustomerActivity(user.id, businessIds);
  done.push("reseñas propias, favoritos e insignia de cliente");

  return { ok: true, seeded: done };
}
