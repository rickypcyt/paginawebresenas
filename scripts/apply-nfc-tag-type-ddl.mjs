// Agrega 'business_review' al enum NfcTagType para tags NFC del negocio (sin empleado).
// Uso: node scripts/apply-nfc-tag-type-ddl.mjs
import { config } from "dotenv";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "");
if (!url) {
  console.error("DATABASE_URL no definida");
  process.exit(1);
}

const sql = neon(url);

await sql.query(`ALTER TYPE "NfcTagType" ADD VALUE IF NOT EXISTS 'business_review'`);
console.log("NfcTagType ahora incluye 'business_review'.");
