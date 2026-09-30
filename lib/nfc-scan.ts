import { createHmac, timingSafeEqual } from "node:crypto";

// Token efímero generado en cada tap del NFC: firma el token real del tag con expiración.
// Sirve para que el link de reseña no se pueda compartir ni reutilizar.

const TTL_MS = 10 * 60 * 1000; // 10 minutos

function secret() {
  const value = process.env.NFC_SCAN_SECRET || process.env.BETTER_AUTH_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NFC_SCAN_SECRET must be set in production");
  }
  return "toque-nfc-scan-dev-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createScanToken(tagToken: string, now = Date.now()) {
  const exp = now + TTL_MS;
  const payload = `${tagToken}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyScanToken(value: string, now = Date.now()): { tagToken: string } | null {
  const parts = value.split(".");
  if (parts.length < 3) return null;

  const sig = parts.pop()!;
  const exp = parts.pop()!;
  const tagToken = parts.join(".");
  const payload = `${tagToken}.${exp}`;

  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || now > expNum) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  return { tagToken };
}
