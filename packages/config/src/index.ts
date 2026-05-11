import { z } from "zod";

export const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");

export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
