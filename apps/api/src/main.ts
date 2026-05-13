import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { catalogRoutes } from "./routes/catalogRoutes.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { learningRoutes } from "./routes/learningRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { progressRoutes } from "./routes/progressRoutes.js";
import { aiRoutes } from "./routes/aiRoutes.js";
import { immersionRoutes } from "./routes/immersionRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { connectPrisma, disconnectPrisma } from "./services/prisma.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Public routes
app.use("/health", healthRoutes);
app.use("/api", catalogRoutes);
app.use("/api", learningRoutes);

// Auth routes
app.use("/api", authRoutes);

// Progress routes
app.use("/api", progressRoutes);

// AI routes
app.use("/api", aiRoutes);

// Immersion routes
app.use("/api", immersionRoutes);

// Admin routes
app.use("/api", adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  // Try to connect to database — app still starts if DB unavailable
  await connectPrisma();

  app.listen(env.PORT, () => {
    console.log(`Yapper API listening on http://localhost:${env.PORT}`);
  });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectPrisma();
  process.exit(0);
});

start();
