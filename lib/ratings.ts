import prisma from "@/lib/prisma";

export interface BusinessRating {
  avg: number;
  count: number;
}

/**
 * Devuelve media y número de reseñas por negocio con una única consulta
 * agregada (GROUP BY), en lugar de cargar todas las reseñas en memoria.
 */
export async function getBusinessRatingMap(
  businessIds: string[]
): Promise<Map<string, BusinessRating>> {
  const map = new Map<string, BusinessRating>();
  if (businessIds.length === 0) return map;

  const rows = await prisma.review.groupBy({
    by: ["businessId"],
    where: { businessId: { in: businessIds } },
    _avg: { rating: true },
    _count: { _all: true },
  });

  for (const row of rows) {
    map.set(row.businessId, {
      avg: row._avg.rating ?? 0,
      count: row._count._all,
    });
  }
  return map;
}
