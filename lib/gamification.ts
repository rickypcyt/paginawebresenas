import prisma from "./prisma";

export const LEVELS = [
  { name: "Explorador", minXp: 0 },
  { name: "Colaborador", minXp: 500 },
  { name: "Experto", minXp: 1500 },
  { name: "Embajador", minXp: 4000 },
  { name: "Leyenda", minXp: 8000 },
] as const;

export type LevelName = (typeof LEVELS)[number]["name"];

export function getLevel(xp: number): { name: LevelName; index: number; minXp: number } {
  let currentIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) currentIndex = i;
  }
  return { name: LEVELS[currentIndex].name, index: currentIndex, minXp: LEVELS[currentIndex].minXp };
}

export function getNextLevelXp(xp: number): number | null {
  const { index } = getLevel(xp);
  return LEVELS[index + 1]?.minXp ?? null;
}

export function computeReviewWeight(reputation: number, xp: number): number {
  const { index } = getLevel(xp);
  let weight = 1 + Math.min(reputation / 2000, 0.25) + index * 0.05;
  return Math.min(Math.round(weight * 100) / 100, 1.5);
}

export function formatWeightedRating(rating: number): string {
  return rating.toFixed(1);
}

const ACTION_REWARDS: Record<
  string,
  { xp: number; points: number; reputation?: number }
> = {
  first_review: { xp: 100, points: 50 },
  review: { xp: 25, points: 50 },
  photo: { xp: 10, points: 10 },
  video: { xp: 20, points: 20 },
  answer: { xp: 15, points: 15 },
  complete_profile: { xp: 50, points: 0 },
  add_business: { xp: 80, points: 100 },
  redeem_offer: { xp: 10, points: 20 },
  discover_business: { xp: 300, points: 100 },
  helpful_review: { xp: 0, points: 0, reputation: 5 },
  helpful_photo: { xp: 0, points: 0, reputation: 3 },
  accepted_answer: { xp: 0, points: 0, reputation: 8 },
  valid_report: { xp: 0, points: 0, reputation: 10 },
  spam_review: { xp: 0, points: 0, reputation: -30 },
  false_report: { xp: 0, points: 0, reputation: -10 },
};

export async function awardAction(userId: string, action: keyof typeof ACTION_REWARDS) {
  const reward = ACTION_REWARDS[action];
  if (!reward) return null;

  const updateData: { xp?: { increment: number }; points?: { increment: number }; reputation?: { increment: number } } = {};
  if (reward.xp) updateData.xp = { increment: reward.xp };
  if (reward.points) updateData.points = { increment: reward.points };
  if (typeof reward.reputation === "number") {
    updateData.reputation = { increment: reward.reputation };
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, xp: true, points: true, reputation: true },
  });

  await checkBadges(userId);

  return { action, ...reward, current: updated };
}

export async function ensureBadge(slug: string, name: string, icon: string, description?: string) {
  return prisma.badge.upsert({
    where: { slug },
    update: {},
    create: { slug, name, icon, description },
  });
}

export async function awardBadge(userId: string, badgeSlug: string) {
  const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
  if (!badge) return null;

  try {
    return await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });
  } catch {
    return null;
  }
}

export async function checkBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      reviews: { select: { businessId: true } },
      businesses: { select: { id: true } },
      badges: { select: { badge: { select: { slug: true } } } },
    },
  });

  if (!user) return;

  const owned = new Set(user.badges.map((b) => b.badge.slug));
  const distinctBusinesses = new Set(user.reviews.map((r) => r.businessId)).size;

  const badgesToAward = [];

  if (!owned.has("first-review") && user.reviews.length > 0) {
    badgesToAward.push("first-review");
  }
  if (!owned.has("explorer") && distinctBusinesses >= 50) {
    badgesToAward.push("explorer");
  }
  if (!owned.has("first-business") && user.businesses.length > 0) {
    badgesToAward.push("first-business");
  }

  for (const slug of badgesToAward) {
    await awardBadge(userId, slug);
  }
}
