import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient(connectionString: string | null | undefined) {
  if (!connectionString) {
    throw new Error("Database connection string is missing")
  }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient(process.env.MASTER_DATABASE_URL) // Use master DB URL as the single DB

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

