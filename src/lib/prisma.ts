import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as any;

export const prisma: PrismaClient = globalForPrisma.prisma ??
  new PrismaClient({ accelerateUrl: process.env.DATABASE_URL ?? "file:./dev.db" } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
