import { test, expect } from "@playwright/test";

const SKIPPED_PROTOCOLS = new Set([
  "mailto:",
  "tel:",
  "sms:",
  "javascript:",
  "data:",
  "blob:",
  "webcal:",
]);

function decodeXmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function extractSitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gis)].map((match) =>
    decodeXmlEntities(match[1].trim())
  );
}

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

test.describe("Site-wide internal links", () => {
  test("should resolve every internal link discovered from the sitemap", async ({
    page,
    request,
    baseURL,
  }) => {
    test.setTimeout(180000);

    expect(baseURL).toBeTruthy();

    const localBaseUrl = new URL(baseURL);
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBeTruthy();

    const sitemapXml = await sitemapResponse.text();
    const sitemapLocations = extractSitemapLocations(sitemapXml);
    const internalHostnames = new Set([localBaseUrl.hostname]);

    for (const sitemapLocation of sitemapLocations) {
      try {
        internalHostnames.add(new URL(sitemapLocation).hostname);
      } catch {
        // Ignore malformed entries here; the request checks below will fail on the local URL if needed.
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

    const visitedUrls = new Set();
    const failures = [];

    while (pendingUrls.size > 0) {
      const [currentUrl] = pendingUrls;
      pendingUrls.delete(currentUrl);

      if (visitedUrls.has(currentUrl)) {
        continue;
      }

      visitedUrls.add(currentUrl);

      const response = await request.get(currentUrl);

      if (!response.ok()) {
        failures.push(`Page returned ${response.status()} for ${currentUrl}`);
        continue;
      }

      const contentType = response.headers()["content-type"] || "";
      if (!contentType.includes("text/html")) {
        continue;
      }

      const html = await response.text();
      await page.setContent(html);

      const hrefValues = await page
        .locator("a[href]")
        .evaluateAll((anchors) =>
          anchors.map((anchor) => anchor.getAttribute("href"))
        );

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

        const linkResponse = await request.get(normalizedUrl);

        if (!linkResponse.ok()) {
          failures.push(
            `${currentUrl} links to ${normalizedUrl}, which returned ${linkResponse.status()}`
          );
        }
      }
    }

    expect(
      failures,
      `Broken internal links found:\n${failures.join("\n")}`
    ).toEqual([]);
  });
});
