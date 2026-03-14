import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.SITE_URL || "http://localhost:3081";
const SITE_DIR = process.env.SITE_DIR || "_site";

const SKIPPED_PROTOCOLS = new Set([
  "mailto:",
  "tel:",
  "sms:",
  "javascript:",
  "data:",
  "blob:",
  "webcal:",
]);

function createNormalizedUrl(value, currentUrl, internalHostnames, baseUrl) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.startsWith("#")) {
    return null;
  }

  const matchingProtocol = [...SKIPPED_PROTOCOLS].find((protocol) =>
    trimmedValue.toLowerCase().startsWith(protocol)
  );

  if (matchingProtocol) {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(trimmedValue, currentUrl);
  } catch {
    return null;
  }

  if (!internalHostnames.has(parsedUrl.hostname)) {
    return null;
  }

  const normalizedUrl = new URL(parsedUrl.pathname + parsedUrl.search, baseUrl);
  normalizedUrl.hash = "";

  return normalizedUrl.toString();
}

function isHtmlLikeUrl(urlString) {
  const { pathname } = new URL(urlString);
  return !/\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith(".html");
}

function loadRedirectSources(redirectsFile) {
  const redirectPaths = new Set();
  try {
    const content = readFileSync(redirectsFile, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        redirectPaths.add(parts[0]);
      }
    }
  } catch {
    // _redirects file not found; proceed without it
  }
  return redirectPaths;
}

function extractHrefs(html) {
  const hrefs = [];
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

describe("Site-wide internal links", () => {
  let serverProcess;

  before(async () => {
    serverProcess = spawn(
      "npx",
      ["http-server", SITE_DIR, "-p", "3081", "--silent"],
      { stdio: "ignore" }
    );
    // Give the server time to start
    await sleep(2000);
  });

  after(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it(
    "should resolve every internal link discovered from the sitemap",
    { timeout: 180000 },
    async () => {
      const localBaseUrl = new URL(BASE_URL);

      const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
      assert.ok(
        sitemapResponse.ok,
        `Sitemap request failed: ${sitemapResponse.status}`
      );

      const sitemapXml = await sitemapResponse.text();
      const sitemapLocations = [
        ...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((match) => match[1].trim());

      const internalHostnames = new Set([localBaseUrl.hostname]);

      for (const location of sitemapLocations) {
        try {
          internalHostnames.add(new URL(location).hostname);
        } catch {
          // ignore malformed entries
        }
      }

      const pendingUrls = new Set(
        sitemapLocations.map((location) => {
          try {
            const parsedUrl = new URL(location);
            return new URL(
              parsedUrl.pathname + parsedUrl.search,
              localBaseUrl
            ).toString();
          } catch {
            return new URL(location, localBaseUrl).toString();
          }
        })
      );
      pendingUrls.add(new URL("/", localBaseUrl).toString());

      const redirectSources = loadRedirectSources(
        join(process.cwd(), SITE_DIR, "_redirects")
      );

      const visitedUrls = new Set();
      const failures = [];

      while (pendingUrls.size > 0) {
        const [currentUrl] = pendingUrls;
        pendingUrls.delete(currentUrl);

        if (visitedUrls.has(currentUrl)) {
          continue;
        }

        visitedUrls.add(currentUrl);

        const pathname = new URL(currentUrl).pathname.replace(/\/$/, "") || "/";
        if (redirectSources.has(pathname)) {
          continue;
        }

        let response;
        try {
          response = await fetch(currentUrl);
        } catch (error) {
          failures.push(`Failed to fetch ${currentUrl}: ${error.message}`);
          continue;
        }

        if (!response.ok) {
          failures.push(`Page returned ${response.status} for ${currentUrl}`);
          continue;
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) {
          continue;
        }

        const html = await response.text();
        const hrefValues = extractHrefs(html);

        for (const hrefValue of hrefValues) {
          const normalizedUrl = createNormalizedUrl(
            hrefValue,
            currentUrl,
            internalHostnames,
            localBaseUrl
          );

          if (!normalizedUrl || visitedUrls.has(normalizedUrl)) {
            continue;
          }

          if (isHtmlLikeUrl(normalizedUrl)) {
            pendingUrls.add(normalizedUrl);
            continue;
          }

          let linkResponse;
          try {
            linkResponse = await fetch(normalizedUrl);
          } catch (error) {
            failures.push(
              `${currentUrl} links to ${normalizedUrl}, fetch failed: ${error.message}`
            );
            continue;
          }

          if (!linkResponse.ok) {
            failures.push(
              `${currentUrl} links to ${normalizedUrl}, which returned ${linkResponse.status}`
            );
          }
        }
      }

      assert.deepStrictEqual(
        failures,
        [],
        `Broken internal links found:\n${failures.join("\n")}`
      );
    }
  );
});
