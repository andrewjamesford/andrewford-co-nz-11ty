export default (eleventyConfig) => {
  // Validate heading hierarchy with simple regex (no JSDOM dependency)
  eleventyConfig.addTransform("validateHeadings", (content, outputPath) => {
    // Only check HTML files
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    try {
      // Simple regex-based heading validation
      const h1Matches = content.match(/<h1[^>]*>/gi) || [];
      const headingMatches = content.match(/<h[1-6][^>]*>/gi) || [];

      // Check for multiple H1s
      if (h1Matches.length > 1) {
        console.warn(
          `⚠️  Multiple H1 tags found in ${outputPath} (found ${h1Matches.length})`
        );
      }

      // Check if no H1 exists (except for special pages)
      const isSpecialPage =
        outputPath.includes("404") ||
        outputPath.includes("sitemap") || 
        outputPath.includes("feed");

      if (h1Matches.length === 0 && !isSpecialPage) {
        console.warn(`⚠️  No H1 tag found in ${outputPath}`);
      }

      // Basic heading level validation
      if (headingMatches.length > 0) {
        const levels = headingMatches.map((h) =>
          parseInt(h.match(/<h([1-6])/)[1])
        );
        for (let i = 1; i < levels.length; i++) {
          if (levels[i] > levels[i - 1] + 1) {
            console.warn(
              `⚠️  Potential heading level skip in ${outputPath}: H${
                levels[i - 1]
              } → H${levels[i]}`
            );
            break; // Only warn once per page
          }
        }
      }
    } catch (error) {
      // Silently skip if validation fails
    }

    return content;
  });

  // Add SEO title filter
  eleventyConfig.addFilter("seoTitle", (title, pageUrl) => {
    const brand = "Andrew Ford";

    // Homepage
    if (pageUrl === "/") {
      return `${brand} - Full Stack Developer, Mentor & Educator`;
    }

    // Determine page type from URL
    let prefix = brand;
    if (pageUrl && pageUrl.includes("/archive/")) {
      prefix = `${brand} - Archive`;
    } else if (pageUrl && pageUrl.includes("/notes/")) {
      prefix = `${brand} - Note`;
    }

    // Build title
    const fullTitle = title ? `${prefix} - ${title}` : prefix;

    // Warn if too long
    if (fullTitle.length > 60) {
      console.warn(
        `⚠️  Title too long (${fullTitle.length} chars): ${fullTitle.substring(
          0,
          50
        )}...`
      );
    }

    return fullTitle;
  });

  // Track meta descriptions for uniqueness validation
  const metaDescriptions = new Map();

  // Add transform to validate meta description uniqueness
  eleventyConfig.addTransform(
    "validateMetaDescriptions",
    (content, outputPath) => {
      // Only check HTML files
      if (!outputPath || !outputPath.endsWith(".html")) {
        return content;
      }

      try {
        // Extract meta description
        const metaMatch = content.match(
          /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i
        );

        if (metaMatch) {
          const description = metaMatch[1];
          const normalizedDesc = description.toLowerCase().trim();

          // Skip very generic or fallback descriptions
          if (
            normalizedDesc.includes("andrew ford is a full-stack") ||
            normalizedDesc.length < 10
          ) {
            return content;
          }

          // Check for duplicates
          if (metaDescriptions.has(normalizedDesc)) {
            const existingPath = metaDescriptions.get(normalizedDesc);
            console.warn(`⚠️  Duplicate meta description found:`);
            console.warn(`   First: ${existingPath}`);
            console.warn(`   Duplicate: ${outputPath}`);
            console.warn(
              `   Description: "${description.substring(0, 80)}..."`
            );
          } else {
            metaDescriptions.set(normalizedDesc, outputPath);
          }
        }
      } catch (error) {
        // Silently skip if validation fails
      }

      return content;
    }
  );
};
