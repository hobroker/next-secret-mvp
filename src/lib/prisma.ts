import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as any;

export const prisma: PrismaClient = globalForPrisma.prisma ??
  // Use the standard PrismaClient; DATABASE_URL is read from environment (e.g. file:./dev.db for SQLite)
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
