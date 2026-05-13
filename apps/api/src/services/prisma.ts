import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

let prisma: PrismaClient | null = null;
let dbAvailable = false;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    });
  }
  return prisma;
}

export async function connectPrisma(): Promise<boolean> {
  try {
    await getPrisma().$connect();
    dbAvailable = true;
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    dbAvailable = false;
    console.warn("Database unavailable — falling back to seed data:", (error as Error).message);
    return false;
  }
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    dbAvailable = false;
  }
}

export function isDbAvailable(): boolean {
  return dbAvailable;
}
