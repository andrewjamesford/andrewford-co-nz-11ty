export default {
  // Helper to determine which schemas should be included on a page
  getSchemaTypes(page, content) {
    const schemas = [];

    // Always include Person and Organization on every page
    schemas.push("person", "organization");

    // Homepage gets WebSite schema
    if (page.url === "/") {
      schemas.push("website");
    }

    // Articles and archive posts get Article schema
    if (
      page.inputPath &&
      (page.inputPath.includes("/articles/") ||
        page.inputPath.includes("/archive/"))
    ) {
      schemas.push("article");
    }

    // Any page with breadcrumbs (not homepage)
    if (page.url !== "/" && page.url !== "/404.html") {
      schemas.push("breadcrumb");
    }

    // Check for YouTube embeds in content
    if (
      content &&
      (content.includes("youtube.com/embed/") ||
        content.includes("youtu.be/") ||
        content.includes("youtube-embed"))
    ) {
      schemas.push("video");
    }

    // Check for FAQ content (requires faqItems in frontmatter)
    if (page.data && page.data.faqItems && page.data.faqItems.length > 0) {
      schemas.push("faq");
    }

    return schemas;
  },

  // Generate a properly formatted image object for schemas
  getImageObject(imageUrl, width = 1200, height = 630) {
    return {
      "@type": "ImageObject",
      url: imageUrl,
      width: width,
      height: height,
    };
  },

  // Clean and truncate text for descriptions
  cleanDescription(text, maxLength = 160) {
    if (!text) return "";

    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, "");

    // Remove markdown formatting
    cleaned = cleaned
      .replace(/[#*_`\[\]()]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Truncate and add ellipsis if needed
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength - 3) + "...";
    }

    return cleaned;
  },

  // Format date for schema
  formatSchemaDate(date) {
    if (!date) return new Date().toISOString();

    if (date instanceof Date) {
      return date.toISOString();
    }

    return new Date(date).toISOString();
  },
};
