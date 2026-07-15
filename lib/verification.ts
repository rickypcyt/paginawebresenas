import crypto from "crypto";

const QR_SECRET: string =
  process.env.QR_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "dev-secret-change-me");

if (!QR_SECRET) {
  throw new Error("QR_SECRET must be set in production");
}

export function getDistanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isWithinRadius(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radiusMeters = 50
): boolean {
  return getDistanceInMeters(lat1, lng1, lat2, lng2) <= radiusMeters;
}

function timeWindow(window: "day" | "30s"): string {
  if (window === "30s") {
    const now = Math.floor(Date.now() / 1000);
    return String(Math.floor(now / 30));
  }
  return new Date().toISOString().slice(0, 10);
}

export function generateQrToken(
  businessId: string,
  window: "day" | "30s" = "day"
): string {
  return crypto
    .createHmac("sha256", QR_SECRET)
    .update(`${businessId}:${window}:${timeWindow(window)}`)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}

export function verifyQrToken(
  businessId: string,
  token: string,
  window: "day" | "30s" = "day"
): boolean {
  const expected = generateQrToken(businessId, window);
  const expectedBuf = Buffer.from(expected);
  const tokenBuf = Buffer.from(token.toUpperCase());
  if (expectedBuf.length !== tokenBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, tokenBuf);
}
