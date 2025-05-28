require("dotenv").config();

module.exports = {
  // Only expose safe environment variables to the frontend
  // Never expose secrets, API keys, or sensitive data

  NODE_ENV: process.env.NODE_ENV || "development",

  // URLs
  SITE_URL: process.env.SITE_URL || "http://localhost:8080",
  API_URL: process.env.API_URL || "http://localhost:8888",
  SERVERLESS_URL:
    process.env.SERVERLESS_URL ||
    process.env.NETLIFY_URL ||
    process.env.SITE_URL ||
    "http://localhost:8888",

  // Feature flags
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG: process.env.NODE_ENV === "development",

  // Public configuration
  GTAG: process.env.GTAG,

  // Build information
  BUILD_TIME: new Date().toISOString(),
  NETLIFY_CONTEXT: process.env.CONTEXT, // Netlify build context

  // Safe to expose these Netlify variables
  DEPLOY_URL: process.env.DEPLOY_URL,
  DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
};
