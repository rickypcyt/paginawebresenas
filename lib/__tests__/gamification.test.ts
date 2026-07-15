import { describe, it, expect } from "vitest";
import {
  LEVELS,
  getLevel,
  getNextLevelXp,
  computeReviewWeight,
  formatWeightedRating,
} from "@/lib/gamification";

describe("getLevel", () => {
  it("returns first level for 0 xp", () => {
    const result = getLevel(0);
    expect(result.name).toBe("Explorador");
    expect(result.index).toBe(0);
  });

  it("returns second level for 500 xp", () => {
    const result = getLevel(500);
    expect(result.name).toBe("Colaborador");
    expect(result.index).toBe(1);
  });

  it("returns top level for very high xp", () => {
    const result = getLevel(100000);
    expect(result.name).toBe("Leyenda");
    expect(result.index).toBe(LEVELS.length - 1);
  });

  it("returns correct level for boundary value", () => {
    expect(getLevel(1499).name).toBe("Colaborador");
    expect(getLevel(1500).name).toBe("Experto");
  });
});

describe("getNextLevelXp", () => {
  it("returns next level xp threshold", () => {
    expect(getNextLevelXp(0)).toBe(500);
    expect(getNextLevelXp(500)).toBe(1500);
  });

  it("returns null at max level", () => {
    expect(getNextLevelXp(8000)).toBeNull();
    expect(getNextLevelXp(99999)).toBeNull();
  });
});

describe("computeReviewWeight", () => {
  it("returns base weight for new user", () => {
    const weight = computeReviewWeight(0, 0);
    expect(weight).toBe(1.0);
  });

  it("increases with reputation", () => {
    const weight = computeReviewWeight(2000, 0);
    expect(weight).toBeGreaterThan(1.0);
  });

  it("increases with level", () => {
    const weight = computeReviewWeight(0, 1500);
    expect(weight).toBeGreaterThan(1.0);
  });

  it("caps at 1.5", () => {
    const weight = computeReviewWeight(10000, 100000);
    expect(weight).toBeLessThanOrEqual(1.5);
  });
});

describe("formatWeightedRating", () => {
  it("formats to 1 decimal place", () => {
    expect(formatWeightedRating(4.567)).toBe("4.6");
    expect(formatWeightedRating(3)).toBe("3.0");
  });
});
