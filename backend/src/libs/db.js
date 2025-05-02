import { PrismaClient } from "../generated/prisma/index.js";

const globalPrisma = globalThis;

export const db = globalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalPrisma.prisma = db; // Prevents multiple instances of Prisma Client in development
}
