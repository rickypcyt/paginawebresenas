import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({
  paymentCreate: vi.fn(),
  paymentUpdate: vi.fn(),
  paymentFindFirst: vi.fn(),
  createSession: vi.fn(),
  placetopayMockMode: vi.fn(),
  verifyNotificationSignature: vi.fn(),
  mapPlacetopayStatus: vi.fn(),
  canUpdatePaymentStatus: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    payment: {
      create: mocks.paymentCreate,
      update: mocks.paymentUpdate,
      findFirst: mocks.paymentFindFirst,
    },
  },
}));

vi.mock("@/lib/placetopay", () => ({
  createSession: mocks.createSession,
  placetopayMockMode: mocks.placetopayMockMode,
  verifyNotificationSignature: mocks.verifyNotificationSignature,
  mapPlacetopayStatus: mocks.mapPlacetopayStatus,
  canUpdatePaymentStatus: mocks.canUpdatePaymentStatus,
}));

vi.mock("@/lib/api-utils", () => ({
  withErrorHandler: (handler: (...args: never[]) => unknown) => handler,
  rateLimit: () => true,
  rateLimitResponse: () => NextResponse.json({ error: "limit" }, { status: 429 }),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "user-agent": "Vitest" }),
}));

import { POST as checkoutPost } from "@/app/api/checkout/route";
import { POST as webhookPost } from "@/app/api/webhooks/placetopay/route";

function request(path: string, body: unknown) {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.placetopayMockMode.mockReturnValue(false);
});

describe("POST /api/checkout", () => {
  it("rejects malformed checkout data before writing to the database", async () => {
    const response = await checkoutPost(request("/api/checkout", { product: "starter" }));

    expect(response.status).toBe(400);
    expect(mocks.paymentCreate).not.toHaveBeenCalled();
  });

  it("creates a mock checkout session", async () => {
    mocks.placetopayMockMode.mockReturnValue(true);
    mocks.paymentCreate.mockResolvedValue({ id: "pay-1" });
    mocks.paymentUpdate.mockResolvedValue({});

    const response = await checkoutPost(request("/api/checkout", {
      product: "starter",
      quantity: 2,
      buyerName: "Ana",
      buyerEmail: "ANA@EXAMPLE.COM",
      businessName: "Café",
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      processUrl: expect.stringContaining("/checkout/mock?reference="),
      mock: true,
    });
    expect(mocks.paymentCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ buyerEmail: "ana@example.com", quantity: 2 }),
    });
    expect(mocks.paymentUpdate).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: expect.objectContaining({ requestId: "mock-pay-1" }),
    });
  });

  it("marks the payment as failed when the provider rejects session creation", async () => {
    mocks.paymentCreate.mockResolvedValue({ id: "pay-2" });
    mocks.paymentUpdate.mockResolvedValue({});
    mocks.createSession.mockRejectedValue(new Error("provider unavailable"));

    await expect(checkoutPost(request("/api/checkout", {
      product: "tag-a",
      buyerName: "Ana",
      buyerEmail: "ana@example.com",
      businessName: "Café",
    }))).rejects.toThrow("provider unavailable");

    expect(mocks.paymentUpdate).toHaveBeenCalledWith({
      where: { id: "pay-2" },
      data: { status: "failed" },
    });
  });
});

describe("POST /api/webhooks/placetopay", () => {
  const notification = {
    requestId: 123,
    reference: "TQ-123",
    signature: "valid",
    status: { status: "APPROVED", date: "2026-01-01T00:00:00Z" },
  };

  it("rejects notifications with an invalid signature", async () => {
    mocks.verifyNotificationSignature.mockReturnValue(false);

    const response = await webhookPost(request("/api/webhooks/placetopay", notification));

    expect(response.status).toBe(400);
    expect(mocks.paymentFindFirst).not.toHaveBeenCalled();
  });

  it("atomically promotes a pending payment to approved", async () => {
    mocks.verifyNotificationSignature.mockReturnValue(true);
    mocks.paymentFindFirst.mockResolvedValue({ id: "pay-3", reference: "TQ-123", status: "pending" });
    mocks.mapPlacetopayStatus.mockReturnValue("approved");
    mocks.canUpdatePaymentStatus.mockReturnValue(true);
    mocks.paymentUpdate.mockResolvedValue({});

    const response = await webhookPost(request("/api/webhooks/placetopay", notification));

    expect(response.status).toBe(200);
    expect(mocks.paymentUpdate).toHaveBeenCalledWith({
      where: { id: "pay-3", status: "pending" },
      data: { status: "approved" },
    });
  });

  it("preserves a terminal payment when a late notification arrives", async () => {
    mocks.verifyNotificationSignature.mockReturnValue(true);
    mocks.paymentFindFirst.mockResolvedValue({ id: "pay-4", reference: "TQ-123", status: "approved" });
    mocks.mapPlacetopayStatus.mockReturnValue("rejected");
    mocks.canUpdatePaymentStatus.mockReturnValue(false);

    const response = await webhookPost(request("/api/webhooks/placetopay", notification));

    expect(response.status).toBe(200);
    expect(mocks.paymentUpdate).not.toHaveBeenCalled();
  });
});
