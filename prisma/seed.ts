import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

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

  const sampleBusinesses = [
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
        status: sample.status as any,
        featured: sample.featured,
        imageUrl: sample.imageUrl,
        latitude: sample.latitude,
        longitude: sample.longitude,
      },
    });
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
