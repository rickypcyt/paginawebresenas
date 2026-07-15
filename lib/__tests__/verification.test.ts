import { describe, it, expect } from "vitest";

describe("getDistanceInMeters", () => {
  it("returns 0 for same coordinates", async () => {
    const { getDistanceInMeters } = await import("@/lib/verification");
    expect(getDistanceInMeters(-2.1894, -79.8891, -2.1894, -79.8891)).toBe(0);
  });

  it("calculates distance between two nearby points", async () => {
    const { getDistanceInMeters } = await import("@/lib/verification");
    const dist = getDistanceInMeters(-2.1894, -79.8891, -2.1895, -79.8892);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(50);
  });
});

describe("isWithinRadius", () => {
  it("returns true when within 50m", async () => {
    const { isWithinRadius } = await import("@/lib/verification");
    expect(isWithinRadius(-2.1894, -79.8891, -2.1894, -79.8891)).toBe(true);
  });

  it("returns false when far away", async () => {
    const { isWithinRadius } = await import("@/lib/verification");
    expect(isWithinRadius(-2.1894, -79.8891, -2.5, -80.0)).toBe(false);
  });

  it("respects custom radius", async () => {
    const { isWithinRadius } = await import("@/lib/verification");
    expect(isWithinRadius(-2.1894, -79.8891, -2.1895, -79.8892, 1000)).toBe(true);
  });
});

describe("QR token", () => {
  it("generates and verifies a valid token", async () => {
    const { generateQrToken, verifyQrToken } = await import("@/lib/verification");
    const token = generateQrToken("business-123", "day");
    expect(verifyQrToken("business-123", token, "day")).toBe(true);
  });

  it("rejects wrong business id", async () => {
    const { generateQrToken, verifyQrToken } = await import("@/lib/verification");
    const token = generateQrToken("business-123", "day");
    expect(verifyQrToken("business-456", token, "day")).toBe(false);
  });

  it("rejects token with wrong length without crashing", async () => {
    const { verifyQrToken } = await import("@/lib/verification");
    expect(verifyQrToken("business-123", "SHORT", "day")).toBe(false);
  });

  it("rejects empty token", async () => {
    const { verifyQrToken } = await import("@/lib/verification");
    expect(verifyQrToken("business-123", "", "day")).toBe(false);
  });
});
