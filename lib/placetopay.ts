import crypto from "crypto";

type PlacetopayAuth = {
  login: string;
  tranKey: string;
  nonce: string;
  seed: string;
};

type PlacetopayStatus =
  | "OK"
  | "FAILED"
  | "APPROVED"
  | "APPROVED_PARTIAL"
  | "PARTIAL_EXPIRED"
  | "REJECTED"
  | "PENDING"
  | "FAILED_PARTIAL"
  | "REFUNDED"
  | string;

type SessionResponse = {
  status: { status: PlacetopayStatus; message?: string };
  requestId?: number;
  processUrl?: string;
};

export type SessionInformation = {
  requestId?: number;
  status?: { status: PlacetopayStatus; reason?: string; message?: string; date?: string };
  payment?: { status?: { status: PlacetopayStatus } }[];
};

function config() {
  const login = process.env.PLACETOPAY_LOGIN;
  const tranKey = process.env.PLACETOPAY_TRANKEY;
  const baseUrl =
    process.env.PLACETOPAY_BASE_URL ?? "https://checkout-co.placetopay.dev";
  if (!login || !tranKey) return null;
  return { login, tranKey, baseUrl };
}

export function placetopayMockMode(): boolean {
  return process.env.PLACETOPAY_MOCK === "true" || !config();
}

function createAuth(cfg: NonNullable<ReturnType<typeof config>>): PlacetopayAuth {
  const nonceBytes = crypto.randomBytes(16);
  const seed = new Date().toISOString();
  const tranKey = crypto
    .createHash("sha256")
    .update(nonceBytes)
    .update(seed + cfg.tranKey)
    .digest("base64");
  return {
    login: cfg.login,
    tranKey,
    nonce: nonceBytes.toString("base64"),
    seed,
  };
}

export function verifyNotificationSignature(body: {
  requestId?: number | string;
  signature?: string;
  status?: { status?: string; date?: string };
}): boolean {
  const cfg = config();
  if (!cfg || !body.requestId || !body.signature || !body.status?.status || !body.status?.date) {
    return false;
  }
  const expected = crypto
    .createHash("sha1")
    .update(
      `${body.requestId}${body.status.status}${body.status.date}${cfg.tranKey}`
    )
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(String(body.signature))
  );
}

export function mapPlacetopayStatus(
  status: PlacetopayStatus | undefined
): "pending" | "approved" | "rejected" | "expired" | "failed" {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
    case "FAILED_PARTIAL":
    case "REFUNDED":
      return "rejected";
    case "PARTIAL_EXPIRED":
      return "expired";
    case "FAILED":
      return "failed";
    default:
      return "pending";
  }
}

export async function createSession(input: {
  reference: string;
  description: string;
  total: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  ipAddress: string;
  userAgent: string;
  buyer: { name: string; email: string; mobile?: string };
}): Promise<SessionResponse> {
  const cfg = config();
  if (!cfg) {
    throw new Error("PlacetoPay no está configurado (faltan credenciales)");
  }

  const res = await fetch(`${cfg.baseUrl}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale: "es",
      auth: createAuth(cfg),
      buyer: {
        name: input.buyer.name,
        email: input.buyer.email,
        mobile: input.buyer.mobile,
      },
      payment: {
        reference: input.reference,
        description: input.description,
        amount: {
          currency: input.currency,
          total: input.total,
        },
      },
      expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }),
  });

  const data: SessionResponse = await res.json();
  if (!res.ok || data.status.status === "FAILED") {
    throw new Error(data.status.message ?? "PlacetoPay rechazó la sesión");
  }
  return data;
}

export async function querySession(
  requestId: string | number
): Promise<SessionInformation> {
  const cfg = config();
  if (!cfg) {
    throw new Error("PlacetoPay no está configurado (faltan credenciales)");
  }

  const res = await fetch(`${cfg.baseUrl}/api/session/${requestId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auth: createAuth(cfg) }),
  });

  const data: SessionInformation = await res.json();
  if (!res.ok) {
    throw new Error("No se pudo consultar la sesión de PlacetoPay");
  }
  return data;
}
