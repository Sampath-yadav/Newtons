import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { studentPhoneGuard } from "./student-phone-guard";

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrisma> };

function createPrisma() {
  // Runtime connects through Supabase's Transaction pooler (PgBouncer, port 6543),
  // which multiplexes thousands of short requests onto a few server connections.
  // Tuned for Vercel serverless: each lambda instance keeps only a tiny pool, and
  // a burst request waits briefly for a slot (then errors cleanly) instead of
  // hanging on a blank page.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3, // small per-instance ceiling so many lambdas don't overwhelm the pooler
    connectionTimeoutMillis: 10_000, // wait up to 10s for a free slot under burst
    idleTimeoutMillis: 10_000, // release idle connections quickly
    allowExitOnIdle: true, // don't pin pooler slots on warm/idle instances
  });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  // Enforce parent-phone normalisation/validation on every Student write.
  return client.$extends(studentPhoneGuard);
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
