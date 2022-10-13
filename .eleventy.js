const pluginRss = require("@11ty/eleventy-plugin-rss");
const pageAssetsPlugin = require("eleventy-plugin-page-assets");
// const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginResoc = require("@resoc/eleventy-plugin-social-image");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const Image = require("@11ty/eleventy-img");
const path = require("path");

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ["webp", "jpeg"],
  sizes = "100vw"
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: "_site/assets/images",
    urlPath: "/assets/images",
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(imageMetadata, imageAttributes);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(UpgradeHelper);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginResoc, {
    templatesDir: "resoc-templates",
    patchNetlifyToml: true,
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

  eleventyConfig.addShortcode("image", imageShortcode);

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("apple-touch-icon*.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: "parse",
    postsMatching: "content/**/*.md",
  });

  // eleventyConfig.addPlugin(sitemap, {
  //   sitemap: {
  //     hostname: "https://andrewford.co.nz",
  //   },
  // });
};
