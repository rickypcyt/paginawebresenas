import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { hashPassword } from "better-auth/crypto";
import type { BusinessStatus } from "@/src/generated/prisma";

const categories = [
  { name: "Restaurantes", slug: "restaurantes", icon: "🍽️", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop", description: "Restaurantes de todo tipo" },
  { name: "Cafeterías", slug: "cafeterias", icon: "☕", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop", description: "Cafés y lugares para tomar algo" },
  { name: "Hamburguesas", slug: "hamburguesas", icon: "🍔", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop", description: "Hamburgueserías y comida rápida" },
  { name: "Comida Rápida", slug: "comida-rapida", icon: "🍟", imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop", description: "Pollos, tacos y comida para llevar" },
  { name: "Heladerías", slug: "heladerias", icon: "🍦", imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop", description: "Helados y postres" },
  { name: "Bares", slug: "bares", icon: "🍻", imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop", description: "Bares y lounges" },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.business.deleteMany();

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const badges = [
    { slug: "first-review", name: "Primera reseña", icon: "⭐", description: "Publicaste tu primera reseña" },
    { slug: "first-business", name: "Primer negocio", icon: "🏪", description: "Añadiste tu primer negocio" },
    { slug: "explorer", name: "Explorer", icon: "🌍", description: "Reseñaste 50 negocios distintos" },
    { slug: "photographer", name: "Photographer", icon: "📷", description: "Subiste 100 fotos" },
    { slug: "top-reviewer", name: "Top Reviewer", icon: "🏆", description: "Recibiste 100 votos útiles" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
  }

  const existing = await prisma.business.findMany({ select: { slug: true } });
  const slugs = existing.map((b) => b.slug);

  const sampleBusinesses: Array<{
    name: string;
    categorySlug: string;
    city: string;
    address: string;
    description: string;
    hours: string;
    status: BusinessStatus;
    featured: boolean;
    imageUrl: string;
    latitude: number;
    longitude: number;
  }> = [
    {
      name: "Café del Río",
      categorySlug: "cafeterias",
      city: "Guayaquil",
      address: "Av. 9 de Octubre 101 y Pichincha",
      description: "Café ecuatoriano con vista al Malecón.",
      hours: "Lun-Vie 8:00-20:00",
      status: "verified",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop",
      latitude: -2.1894,
      longitude: -79.8891,
    },
    {
      name: "Burger del Puerto",
      categorySlug: "hamburguesas",
      city: "Guayaquil",
      address: "Urdesa, Víctor Emilio Estrada 502",
      description: "Hamburguesas artesanales al estilo guayaco.",
      hours: "Mar-Dom 13:00-23:00",
      status: "verified",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
      latitude: -2.168,
      longitude: -79.91,
    },
    {
      name: "Restaurante Manabí",
      categorySlug: "restaurantes",
      city: "Guayaquil",
      address: "Av. Las Américas 412 y Circunvalación",
      description: "Platos típicos manabitas y mariscos frescos.",
      hours: "Lun-Dom 12:00-22:00",
      status: "verified",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
      latitude: -2.165,
      longitude: -79.895,
    },
    {
      name: "Helados Artesanales Popi",
      categorySlug: "heladerias",
      city: "Guayaquil",
      address: "Urdesa Central, calle Loja 308",
      description: "Helados artesanales con frutas locales.",
      hours: "Lun-Dom 11:00-21:00",
      status: "verified",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop",
      latitude: -2.17,
      longitude: -79.905,
    },
    {
      name: "El Pollo Dorado",
      categorySlug: "comida-rapida",
      city: "Samborondón",
      address: "Km 5.5 Vía Samborondón, Plaza Lagos",
      description: "Pollo asado y menús rápidos para toda la familia.",
      hours: "Lun-Dom 11:00-21:00",
      status: "verified",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop",
      latitude: -2.136,
      longitude: -79.877,
    },
    {
      name: "Barra Lounge 9 de Octubre",
      categorySlug: "bares",
      city: "Guayaquil",
      address: "Av. 9 de Octubre 220 y Malecón",
      description: "Cócteles y música en el corazón del centro.",
      hours: "Mié-Dom 18:00-02:00",
      status: "verified",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop",
      latitude: -2.2058,
      longitude: -79.8976,
    },
  ];

  for (const sample of sampleBusinesses) {
    const category = await prisma.category.findUnique({
      where: { slug: sample.categorySlug },
    });
    if (!category) continue;

    const slug = generateUniqueSlug(sample.name, slugs);
    slugs.push(slug);

    await prisma.business.upsert({
      where: { slug },
      update: {},
      create: {
        name: sample.name,
        slug,
        categoryId: category.id,
        city: sample.city,
        address: sample.address,
        description: sample.description,
        hours: sample.hours,
        status: sample.status,
        featured: sample.featured,
        imageUrl: sample.imageUrl,
        latitude: sample.latitude,
        longitude: sample.longitude,
      },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const userId = crypto.randomUUID();
      const now = new Date();
      const hashedPassword = await hashPassword(adminPassword);

      await prisma.$transaction([
        prisma.user.create({
          data: {
            id: userId,
            name: "Admin",
            email: adminEmail,
            emailVerified: true,
            role: "admin",
            createdAt: now,
            updatedAt: now,
          },
        }),
        prisma.account.create({
          data: {
            id: crypto.randomUUID(),
            accountId: userId,
            providerId: "credential",
            userId,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
          },
        }),
      ]);

      console.log(`Usuario admin ${adminEmail} creado.`);
    } else {
      console.log(`Usuario admin ${adminEmail} ya existe.`);
    }
  } else {
    console.log("SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD no definidos. Saltando admin.");
  }

  // ---------- Cuentas demo por rol (solo para desarrollo) ----------
  const demoPassword = process.env.SEED_DEMO_PASSWORD || "demo1234";

  async function upsertDemoUser(email: string, name: string, role: "user" | "employee" | "business" | "admin") {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return existing;
    const id = crypto.randomUUID();
    const now = new Date();
    const password = await hashPassword(demoPassword);
    const [user] = await prisma.$transaction([
      prisma.user.create({
        data: { id, name, email, emailVerified: true, role, createdAt: now, updatedAt: now },
      }),
      prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: id,
          providerId: "credential",
          userId: id,
          password,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ]);
    console.log(`Cuenta demo ${email} (${role}) creada.`);
    return user;
  }

  const jefe = await upsertDemoUser("jefe@toque.test", "Jefe Demo", "business");
  const empleado = await upsertDemoUser("empleado@toque.test", "María González", "employee");
  await upsertDemoUser("cliente@toque.test", "Cliente Demo", "user");
  if (!adminEmail || !adminPassword) {
    await upsertDemoUser("admin@toque.test", "Admin Demo", "admin");
  }

  // Negocio demo del jefe con empleados y reseñas para el ranking
  const cafe = await prisma.business.findFirst({
    where: { name: "Café Demo", ownerId: jefe.id },
  });
  const demoBusiness = cafe ?? (await (async () => {
    const category = await prisma.category.findUnique({ where: { slug: "cafeterias" } });
    const slug = generateUniqueSlug("Café Demo", slugs);
    slugs.push(slug);
    const created = await prisma.business.create({
      data: {
        name: "Café Demo",
        slug,
        categoryId: category?.id ?? null,
        ownerId: jefe.id,
        city: "Guayaquil",
        address: "Av. Demo 123",
        description: "Negocio de prueba para el panel del jefe.",
        status: "verified",
      },
    });
    await prisma.nfcTag.create({
      data: {
        token: crypto.randomUUID(),
        label: "NFC reseñas de Google",
        type: "business_google",
        businessId: created.id,
      },
    });
    return created;
  })());

  const demoEmployees: Array<{ name: string; role: string; userId?: string }> = [
    { name: empleado.name, role: "Mesera", userId: empleado.id },
    { name: "Carlos Rivera", role: "Barista" },
    { name: "Ana Torres", role: "Caja" },
  ];

  const employeeIds: string[] = [];
  for (const e of demoEmployees) {
    let employee = await prisma.employee.findFirst({
      where: { businessId: demoBusiness.id, name: e.name },
    });
    employee ??= await prisma.employee.create({
      data: {
        name: e.name,
        role: e.role,
        businessId: demoBusiness.id,
        userId: e.userId ?? null,
      },
    });
    employeeIds.push(employee.id);

    const hasTag = await prisma.nfcTag.findFirst({
      where: { employeeId: employee.id, type: "employee_review" },
    });
    if (!hasTag) {
      await prisma.nfcTag.create({
        data: {
          token: crypto.randomUUID(),
          label: `NFC de ${employee.name}`,
          type: "employee_review",
          businessId: demoBusiness.id,
          employeeId: employee.id,
        },
      });
    }
  }

  const cliente = await prisma.user.findUnique({ where: { email: "cliente@toque.test" } });
  const demoReviewCount = await prisma.review.count({
    where: { businessId: demoBusiness.id, employeeId: { not: null } },
  });
  if (cliente && demoReviewCount === 0) {
    const titles = ["Atención excelente", "Muy buen servicio", "Podría mejorar", "Gran experiencia"];
    const sampleReviews = [
      { emp: 0, rating: 5, t: 0 }, { emp: 0, rating: 5, t: 3 }, { emp: 0, rating: 4, t: 1 },
      { emp: 1, rating: 5, t: 1 }, { emp: 1, rating: 4, t: 3 }, { emp: 1, rating: 4, t: 0 },
      { emp: 2, rating: 4, t: 1 }, { emp: 2, rating: 3, t: 2 }, { emp: 2, rating: 5, t: 3 },
    ];
    await prisma.review.createMany({
      data: sampleReviews.map((r, i) => ({
        title: titles[r.t],
        content: "Reseña de prueba para el ranking del equipo.",
        rating: r.rating,
        verification: "nfc",
        userId: cliente.id,
        businessId: demoBusiness.id,
        employeeId: employeeIds[r.emp],
        createdAt: new Date(Date.now() - i * 26 * 60 * 60 * 1000),
      })),
    });
    console.log("Reseñas demo creadas para Café Demo.");
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
