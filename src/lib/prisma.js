import { PrismaClient } from "@prisma/client";

// Next reloads modules on every edit in dev, so the client is cached on
// globalThis to avoid opening a new connection pool per hot reload.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
