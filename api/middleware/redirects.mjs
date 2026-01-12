import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import logger from "../utils/logger.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse Netlify-style _redirects file and return redirect rules
 */
function parseRedirectsFile(filePath) {
  const rules = [];

  if (!fs.existsSync(filePath)) {
    logger.warn("Redirects file not found", { path: filePath });
    return rules;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      // Parse: /from /to [status]
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const from = parts[0];
        const to = parts[1];
        const status = parseInt(parts[2], 10) || 301;

        // Handle wildcard patterns
        const isWildcard = from.endsWith("/*") || from.endsWith("/*path");
        const pattern = isWildcard ? from.replace(/\/\*(?:path)?$/, "") : from;

        rules.push({
          from: pattern,
          to,
          status,
          isWildcard,
          isExact: !isWildcard,
        });
      }
    }
  } catch (error) {
    logger.error("Error parsing _redirects file", {
      path: filePath,
      error: error.message,
    });
  }

  return rules;
}

/**
 * Express middleware to handle redirects from _redirects file
 */
export function createRedirectMiddleware() {
  const redirectsPath = path.join(__dirname, "../../_site/_redirects");
  const rules = parseRedirectsFile(redirectsPath);

  logger.info("Redirect middleware initialized", { rulesCount: rules.length });

  return (req, res, next) => {
    const requestPath = req.path;

    for (const rule of rules) {
      let matches = false;

      if (rule.isExact) {
        // Exact match (with or without trailing slash)
        const normalizedRequest = requestPath.replace(/\/$/, "");
        const normalizedRule = rule.from.replace(/\/$/, "");
        matches = normalizedRequest === normalizedRule;
      } else if (rule.isWildcard) {
        // Wildcard match - check if path starts with the pattern
        const normalizedRequest = requestPath.replace(/\/$/, "");
        const normalizedRule = rule.from.replace(/\/$/, "");
        matches =
          normalizedRequest === normalizedRule ||
          requestPath.startsWith(rule.from + "/") ||
          requestPath.startsWith(rule.from);
      }

      if (matches) {
        // Build redirect URL, preserving query parameters
        let redirectUrl = rule.to;
        const queryString = req.originalUrl.split("?")[1];
        if (queryString) {
          redirectUrl += `?${queryString}`;
        }

        logger.info("Redirect matched", {
          from: requestPath,
          to: redirectUrl,
          status: rule.status,
        });

        return res.redirect(rule.status, redirectUrl);
      }
    }

    next();
  };
}

export default createRedirectMiddleware;
