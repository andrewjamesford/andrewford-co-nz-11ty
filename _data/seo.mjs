export default {
  // Generate optimized page title
  generateTitle(title, pageUrl, pageType) {
    const brand = "Andrew Ford";

    // Homepage special case
    if (pageUrl === "/") {
      return `${brand} - Full Stack Developer, Mentor & Educator`;
    }

    // Determine page type from URL if not explicitly provided
    if (!pageType && pageUrl) {
      if (pageUrl.includes("/articles/")) pageType = "article";
      else if (pageUrl.includes("/archive/")) pageType = "archive";
      else if (pageUrl.includes("/notes/")) pageType = "note";
      else if (pageUrl === "/article/") pageType = "articles-index";
      else if (pageUrl === "/note/") pageType = "notes-index";
      else if (pageUrl === "/archive/") pageType = "archive-index";
    }

    // Format based on page type
    let formattedTitle = title || "";

    switch (pageType) {
      case "article":
      case "articles-index":
        formattedTitle = title ? `${brand} - ${title}` : `${brand} - Articles`;
        break;
      case "archive":
      case "archive-index":
        formattedTitle = title
          ? `${brand} - Archive - ${title}`
          : `${brand} - Archive`;
        break;
      case "note":
      case "notes-index":
        formattedTitle = title
          ? `${brand} - Note - ${title}`
          : `${brand} - Notes`;
        break;
      default:
        formattedTitle = title ? `${brand} - ${title}` : brand;
    }

    // Validate length and warn if too long
    if (formattedTitle.length > 60) {
      console.warn(
        `Title too long (${formattedTitle.length} chars): ${formattedTitle}`
      );
    }

    return formattedTitle;
  },

  // Auto-generate meta description from content
  generateMetaDescription(description, content, fallback) {
    // Priority 1: Use provided description
    if (description && description.length > 0) {
      return this.truncateDescription(description);
    }

    // Priority 2: Auto-generate from content
    if (content && content.length > 0) {
      const cleaned = this.cleanContent(content);
      return this.truncateDescription(cleaned);
    }

    // Priority 3: Use fallback
    return (
      fallback ||
      "Andrew Ford is a full-stack web developer, mentor and educator teaching people how to code."
    );
  },

  // Clean content for meta description
  cleanContent(content) {
    if (!content) return "";

    let cleaned = content;

    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, "");

    // Remove Nunjucks/Liquid tags
    cleaned = cleaned.replace(/{%[^%]*%}/g, "");
    cleaned = cleaned.replace(/{{[^}]*}}/g, "");

    // Remove markdown formatting
    cleaned = cleaned
      .replace(/^#+\s+/gm, "") // Headers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
      .replace(/\*([^*]+)\*/g, "$1") // Italic
      .replace(/_([^_]+)_/g, "$1") // Italic alt
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/`([^`]+)`/g, "$1") // Inline code
      .replace(/^```[\s\S]*?```$/gm, "") // Code blocks
      .replace(/^>\s+/gm, "") // Blockquotes
      .replace(/^[\*\-]\s+/gm, "") // Lists
      .replace(/^\d+\.\s+/gm, "") // Numbered lists
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
      .replace(/\n+/g, " ") // Multiple newlines
      .replace(/\s+/g, " ") // Multiple spaces
      .trim();

    return cleaned;
  },

  // Truncate description to proper length
  truncateDescription(text, maxLength = 160) {
    if (!text) return "";

    text = text.trim();

    if (text.length <= maxLength) {
      return text;
    }

    // Try to truncate at a word boundary
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > maxLength - 20) {
      return truncated.substring(0, lastSpace) + "...";
    }

    return truncated + "...";
  },
};
