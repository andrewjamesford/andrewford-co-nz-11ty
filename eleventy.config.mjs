import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import markdownIt from "markdown-it";

import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

import pluginDrafts from "./eleventy.config.drafts.js";
import pluginImages from "./eleventy.config.images.js";
import embedYouTube from "eleventy-plugin-youtube-embed";

import dotenv from "dotenv";
dotenv.config();

export default async (eleventyConfig) => {
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

  eleventyConfig.addBundle("css", {
    // Folder (relative to output directory) files will write to
    toFileDirectory: "bundle",

    // File extension used for bundle file output, defaults to bundle name
    outputFileExtension: "css",

    // Name of shortcode for use in templates, defaults to bundle name
    shortcodeName: "css",
    // shortcodeName: false, // disable this feature.

    // Modify bundle content
    transforms: [],

    // If two identical code blocks exist in non-default buckets, they’ll be hoisted to the first bucket in common.
    hoist: true,

    // In 11ty.js templates, having a named export of `bundle` will populate your bundles.
    // bundleExportKey: "bundle",
    bundleExportKey: false, // disable this feature.
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // App plugins
  eleventyConfig.addPlugin(pluginDrafts);
  eleventyConfig.addPlugin(pluginImages);
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

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) =>
        ["all", "nav", "post", "posts", "[articles]", "[archive]"].indexOf(
          tag
        ) === -1
    );
  });

  // Customize Markdown library settings:
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "header-anchor",
        symbol: "#",
        ariaHidden: false,
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

    // The base URL: defaults to Path Prefix
    // baseHref: eleventyConfig.pathPrefix,
    baseHref: "https://andrewford.co.nz/",

    // But you could use a full URL here too:
    // baseHref: "http://example.com/"

    // Comma separated list of output file extensions to apply
    // our transform to. Use `false` to opt-out of the transform.
    extensions: "html",
  };
};
