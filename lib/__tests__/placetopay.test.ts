import { describe, expect, it } from "vitest";
import { canUpdatePaymentStatus, mapPlacetopayStatus } from "@/lib/placetopay";

describe("mapPlacetopayStatus", () => {
  it.each([
    ["APPROVED", "approved"],
    ["REJECTED", "rejected"],
    ["PARTIAL_EXPIRED", "expired"],
    ["FAILED", "failed"],
    ["PENDING", "pending"],
  ] as const)("maps %s to %s", (providerStatus, expected) => {
    expect(mapPlacetopayStatus(providerStatus)).toBe(expected);
  });
});

describe("canUpdatePaymentStatus", () => {
  it("allows a pending payment to reach a terminal state", () => {
    expect(canUpdatePaymentStatus("pending", "approved")).toBe(true);
    expect(canUpdatePaymentStatus("pending", "rejected")).toBe(true);
  });

  it("ignores pending notifications and preserves every terminal state", () => {
    expect(canUpdatePaymentStatus("pending", "pending")).toBe(false);
    expect(canUpdatePaymentStatus("approved", "rejected")).toBe(false);
    expect(canUpdatePaymentStatus("rejected", "approved")).toBe(false);
    expect(canUpdatePaymentStatus("failed", "pending")).toBe(false);
  });
});
