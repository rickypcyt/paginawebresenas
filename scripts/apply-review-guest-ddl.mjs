// Hace Review.userId opcional y agrega Review.guestName para reseñas sin sesión.
// Uso: node scripts/apply-review-guest-ddl.mjs
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

const [col] = await sql`
  SELECT column_name, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'Review' AND column_name = 'userId'
`;

if (!col) {
  console.error("No se encontró Review.userId");
  process.exit(1);
}

await sql.query(`ALTER TABLE "Review" ALTER COLUMN "userId" DROP NOT NULL`);
await sql.query(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "guestName" TEXT`);
console.log("Review.userId ahora es opcional y se agregó Review.guestName.");
