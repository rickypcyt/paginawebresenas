// Agrega Review.nfcScanHash (hash del scan token NFC) para impedir que un mismo
// tap genere más de una reseña, y un índice único que limita a una reseña por
// usuario/negocio/empleado (los huéspedes no tienen userId y quedan fuera).
// Uso: node scripts/apply-review-scan-hash-ddl.mjs
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

await sql.query(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "nfcScanHash" TEXT`);
console.log("OK: columna Review.nfcScanHash");

await sql.query(
  `CREATE UNIQUE INDEX IF NOT EXISTS "Review_nfcScanHash_key" ON "Review"("nfcScanHash")`
);
console.log("OK: índice único Review.nfcScanHash");

// Si hay reseñas duplicadas de un mismo usuario sobre el mismo negocio+empleado,
// este índice fallará — depura los duplicados primero.
await sql.query(
  `CREATE UNIQUE INDEX IF NOT EXISTS "review_user_business_employee_key"
   ON "Review"("userId", "businessId", COALESCE("employeeId", ''))
   WHERE "userId" IS NOT NULL`
);
console.log("OK: índice único review_user_business_employee_key");
