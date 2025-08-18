import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import chatragRouter from "./routes/chatrag.mjs";
import lastplayedRouter from "./routes/lastplayed.mjs";
import latestUploadsRouter from "./routes/latestUploads.mjs";
import logger from "./utils/logger.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: (origin, callback) => {
    let allowedOrigins = ["http://localhost:3000", "https://andrewford.co.nz"];

    if (process.env.ALLOWED_ORIGINS) {
      try {
        // Try parsing as JSON first (in case it's JSON-encoded)
        const parsed = JSON.parse(process.env.ALLOWED_ORIGINS);
        allowedOrigins = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((o) =>
          o.trim()
        );
      }
    }

    // Allow requests with no origin (e.g., mobile apps, Postman)
    // or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log the rejected origin for debugging
      logger.warn(`CORS rejected origin: ${origin}`, {
        origin,
        allowedOrigins,
      });
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

app.use(express.static(path.join(__dirname, "../_site")));

app.use("/api/chatrag", chatragRouter);
app.use("/api/lastplayed", lastplayedRouter);
app.use("/api/latestUploads", latestUploadsRouter);

app.get("/health", async (_req, res) => {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: {
      used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`,
      total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1)} MB`,
      percentage: (
        (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) *
        100
      ).toFixed(1),
    },
  };

  // Test API connections
  const apiStatus = {};

  try {
    // Test environment variables
    apiStatus.openai = process.env.OPENAI_API_KEY ? "configured" : "missing";
    apiStatus.openrouter = process.env.OPENROUTER_API_KEY
      ? "configured"
      : "missing";
    apiStatus.lastfm = process.env.LASTFM_API_KEY ? "configured" : "missing";
    apiStatus.youtube = process.env.YOUTUBE_API_KEY ? "configured" : "missing";

    healthCheck.apis = apiStatus;

    // Check for any critical issues
    const criticalIssues = Object.values(apiStatus).filter(
      (status) => status === "missing"
    ).length;
    if (criticalIssues > 0) {
      healthCheck.status = "degraded";
      healthCheck.warnings = `${criticalIssues} API keys missing`;
    }
  } catch (error) {
    healthCheck.status = "unhealthy";
    healthCheck.error = error.message;
  }

  const statusCode =
    healthCheck.status === "healthy"
      ? 200
      : healthCheck.status === "degraded"
      ? 200
      : 503;

  res.status(statusCode).json(healthCheck);
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../_site/index.html"));
});

app.use((err, req, res, _next) => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server started successfully`, {
      port: PORT,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  });
}

export default app;
