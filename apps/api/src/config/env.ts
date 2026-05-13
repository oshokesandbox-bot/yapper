import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).default("local-dev-access-secret-change-me"),
  JWT_REFRESH_SECRET: z.string().min(16).default("local-dev-refresh-secret-change-me"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  OPENAI_API_KEY: z.string().default(""),
  STRIPE_SECRET_KEY: z.string().default("")
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
