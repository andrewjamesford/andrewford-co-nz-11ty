import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import markdownIt from "markdown-it";
import { minify } from "html-minifier-terser";

import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

import pluginImages from "./eleventy.config.images.mjs";
import pluginDrafts from "./eleventy.config.drafts.mjs";
import pluginSEO from "./eleventy.config.seo.mjs";

import embedYouTube from "eleventy-plugin-youtube-embed";

import dotenv from "dotenv";

export default async (eleventyConfig) => {
  dotenv.config();
  // Create our custom markdown-it instance.
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use((await import("markdown-it-footnote")).default);

  // Create custom footnote block rule
  md.renderer.rules.footnote_block_open = () =>
    "<hr />\n" +
    '<h4 class="footnotes-title">References</h4>\n' +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n';

  // Replacement render_footnote_caption with no [] around the number
  const render_footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) {
      n += `:${tokens[idx].meta.subId}`;
    }
    return n;
  };

  // Replace existing function with one with no []
  md.renderer.rules.footnote_caption = (tokens, idx) =>
    render_footnote_caption(tokens, idx);

  // Overwrite the built-in Markdown library with our custom instance.
  eleventyConfig.setLibrary("md", md);

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  // https://www.11ty.dev/docs/assets/
  https: eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg,jpg}");
  // Watch CSS files for the CSS pipeline.
  eleventyConfig.addWatchTarget("public/**/*.{css}");

  // App plugins
  eleventyConfig.addPlugin(pluginDrafts);
  eleventyConfig.addPlugin(pluginImages);
  eleventyConfig.addPlugin(pluginSEO);
  eleventyConfig.addPlugin(embedYouTube, {
    embedClass: "video",
    lazy: true,
    recommendSelfOnly: true,
    lite: {
      js: {
        inline: true,
      },
      css: {
        inline: true,
      },
      enabled: true,
      responsive: true,
    },
  });

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginBundle);

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
      format || "DDDD"
    );
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", (collection) => {
    const tagSet = new Set();
    for (const item of collection) {
      for (const tag of item.data.tags || []) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet);
  });

  // Decode HTML entities
  eleventyConfig.addFilter("decodeHtmlEntities", (str) => {
    if (!str) return str;

    const htmlEntities = {
      "&quot;": '"',
      "&#34;": '"',
      "&apos;": "'",
      "&#39;": "'",
      "&lt;": "<",
      "&#60;": "<",
      "&gt;": ">",
      "&#62;": ">",
      "&amp;": "&",
      "&#38;": "&",
      "&nbsp;": " ",
      "&#160;": " ",
    };

    return str.replace(
      /&quot;|&#34;|&apos;|&#39;|&lt;|&#60;|&gt;|&#62;|&amp;|&#38;|&nbsp;|&#160;/g,
      (match) => htmlEntities[match] || match
    );
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) =>
        ["all", "nav", "post", "posts", "[articles]", "[archive]"].indexOf(
          tag
        ) === -1
    );
  });

  // SEO Meta Description Filter
  eleventyConfig.addFilter(
    "metaDescription",
    function (description, content, fallback) {
      // Priority 1: Use provided description
      if (description && description.length > 0) {
        return description.substring(0, 160);
      }

      // Priority 2: Auto-generate from content
      if (content && content.length > 0) {
        // Remove HTML tags
        let cleaned = content.replace(/<[^>]*>/g, "");

        // Remove Nunjucks/Liquid tags
        cleaned = cleaned.replace(/{%[^%]*%}/g, "");
        cleaned = cleaned.replace(/{{[^}]*}}/g, "");

        // Remove markdown formatting
        cleaned = cleaned
          .replace(/^#+\s+/gm, "") // Headers
          .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
          .replace(/\n+/g, " ") // Newlines
          .replace(/\s+/g, " ") // Multiple spaces
          .trim();

        // Truncate to 160 chars
        if (cleaned.length > 157) {
          cleaned = cleaned.substring(0, 157) + "...";
        }

        return cleaned;
      }

      // Priority 3: Use fallback
      return (
        fallback ||
        "Andrew Ford is a software engineer, mentor and educator from Tauranga, New Zealand."
      );
    }
  );

  // Customize Markdown library settings:
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "header-anchor",
        symbol: "#",
        ariaHidden: false,
        renderHref: (slug, state) => {
          // Get the base URL from environment variable with fallback
          const baseUrl = process.env.SITE_URL || "https://andrewford.co.nz";
          // Get current page URL from the markdown-it state env
          const pageUrl = state.env?.page?.url || "";
          // Combine to create full URL
          return `${baseUrl}${pageUrl}#${slug}`;
        },
      }),
      level: [1, 2, 3, 4],
      slugify: eleventyConfig.getFilter("slugify"),
    });
  });

  eleventyConfig.addCollection("articles", (collection) =>
    collection
      .getAllSorted()
      .filter((item) => item.inputPath.startsWith("./content/articles/"))
  );

  eleventyConfig.addCollection("archive", (collection) =>
    collection
      .getAllSorted()
      .filter((item) => item.inputPath.startsWith("./content/archive/"))
  );

  eleventyConfig.addCollection("notes", (collection) =>
    collection
      .getAllSorted()
      .filter((item) => item.inputPath.startsWith("./content/notes/"))
  );

  eleventyConfig.addCollection("posts", (collection) =>
    collection
      .getAllSorted()
      .filter(
        (item) =>
          item.inputPath.startsWith("./content/articles/") ||
          item.inputPath.startsWith("./content/notes/")
      )
  );

  eleventyConfig.addBundle("css", {
    // Folder (relative to output directory) files will write to
    toFileDirectory: "css",

    // File extension used for bundle file output, defaults to bundle name
    outputFileExtension: "css",

    // Name of shortcode for use in templates, defaults to bundle name
    shortcodeName: "css",
    // shortcodeName: false, // disable this feature.

    // Modify bundle content
    transforms: [],

    // If two identical code blocks exist in non-default buckets, they'll be hoisted to the first bucket in common.
    hoist: true,

    // In 11ty.js templates, having a named export of `bundle` will populate your bundles.
    bundleExportKey: "bundle",
    // bundleExportKey: false, // disable this feature.
  });

  // HTML Minification in production
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", async function (content) {
      if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
        try {
          return await minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
          });
        } catch (error) {
          console.error("HTML minification failed for:", this.page.outputPath);
          console.error(error);
          return content;
        }
      }
      return content;
    });
  }

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
      input: "content", // default: "."
      includes: "../_includes", // default: "_includes"
      data: "../_data", // default: "_data"
      output: "_site",
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",

    baseHref: "https://andrewford.co.nz/",

    // But you could use a full URL here too:
    // baseHref: "http://example.com/"

    // Comma separated list of output file extensions to apply
    // our transform to. Use `false` to opt-out of the transform.
    extensions: "html",
  };
};
