// Aplica el DDL del modelo Payment sobre Neon vía driver serverless (WebSocket),
// porque prisma db push no alcanza el puerto 5432 desde esta máquina.
// Uso: node scripts/apply-payment-ddl.mjs
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

const statements = [
  `CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected', 'expired', 'failed')`,
  `CREATE TYPE "PaymentProduct" AS ENUM ('tag_a', 'plan_starter', 'plan_business', 'plan_business_plus', 'plan_enterprise')`,
  `CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "requestId" TEXT,
    "processUrl" TEXT,
    "product" "PaymentProduct" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "businessName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX "payment_reference_key" ON "payment"("reference")`,
  `CREATE INDEX "payment_status_idx" ON "payment"("status")`,
  `CREATE INDEX "payment_buyerEmail_idx" ON "payment"("buyerEmail")`,
];

const [exists] = await sql`SELECT to_regclass('public.payment') AS t`;
if (exists?.t) {
  console.log("La tabla payment ya existe — nada que hacer.");
  process.exit(0);
}

for (const stmt of statements) {
  await sql.query(stmt);
  console.log("OK:", stmt.split("\n")[0].slice(0, 60));
}
console.log("Tabla payment creada.");
