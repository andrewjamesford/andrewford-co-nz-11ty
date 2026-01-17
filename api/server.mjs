import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createRedirectMiddleware } from "./middleware/redirects.mjs";
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
    let allowedOrigins = ["http://localhost:3080", "https://andrewford.co.nz"];

    if (process.env.ALLOWED_ORIGINS) {
      const parseOriginsRecursively = (value, depth = 0) => {
        // Prevent infinite recursion
        if (depth > 5) return [];

        if (typeof value !== "string") return [];

        // Clean up the string - remove extra escaping and whitespace
        let cleaned = value.trim();

        // Handle cases where the string is wrapped in extra quotes or brackets
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }

        // Try to parse as JSON
        try {
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) {
            return parsed.flatMap((item) =>
              parseOriginsRecursively(String(item), depth + 1)
            );
          } else if (typeof parsed === "string") {
            return parseOriginsRecursively(parsed, depth + 1);
          } else {
            return [String(parsed)];
          }
        } catch {
          // If not JSON, treat as comma-separated values
          if (cleaned.includes(",")) {
            return cleaned
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean);
          }
          // Single value
          return [cleaned].filter(Boolean);
        }
      };

      try {
        allowedOrigins = parseOriginsRecursively(process.env.ALLOWED_ORIGINS);

        // Filter to only valid URLs
        allowedOrigins = allowedOrigins.filter((origin) => {
          if (!origin || typeof origin !== "string") return false;
          const trimmed = origin.trim();
          return (
            trimmed.startsWith("http://") || trimmed.startsWith("https://")
          );
        });

        // Ensure we have valid origins after parsing
        if (allowedOrigins.length === 0) {
          logger.warn(
            "ALLOWED_ORIGINS parsing resulted in no valid URLs, using defaults",
            {
              original: process.env.ALLOWED_ORIGINS,
              parsed: allowedOrigins,
            }
          );
          allowedOrigins = [
            "http://localhost:3080",
            "https://andrewford.co.nz",
          ];
        }
      } catch (error) {
        logger.error("Error parsing ALLOWED_ORIGINS, using defaults", {
          original: process.env.ALLOWED_ORIGINS,
          error: error.message,
        });
        allowedOrigins = ["http://localhost:3080", "https://andrewford.co.nz"];
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
app.use(
  compression({
    threshold: 1024,
    filter: (req, res) => {
      if (req.path && req.path.startsWith("/api/")) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
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

// Handle redirects from _redirects file before static files
app.use(createRedirectMiddleware());

// Cache static assets with appropriate headers
app.use((req, res, next) => {
  const url = req.url;

  // Images - cache for 1 year
  if (url.match(/\.(avif|webp|png|jpe?g|gif|svg|ico)$/i)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Fonts - cache for 1 year
  else if (url.match(/\.(woff2?|ttf|eot|otf)$/i)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // JS/CSS - cache for 1 year (11ty uses hashed filenames)
  else if (url.match(/\.(js|css)$/i)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // HTML - short cache with revalidation
  else if (url.match(/\.(html?)$/i) || url === "/" || !url.includes(".")) {
    res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
  }
  // Default - moderate cache
  else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }

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

app.get("/*path", (_req, res) => {
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
