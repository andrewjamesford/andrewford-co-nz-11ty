const pluginRss = require("@11ty/eleventy-plugin-rss");
// const pageAssetsPlugin = require("eleventy-plugin-page-assets");
// const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const CleanCSS = require("clean-css");
const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1000],
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
    class: "image",
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(imageMetadata, imageAttributes);
};

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(syntaxHighlight);

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
  eleventyConfig.addPassthroughCopy("apple-*.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-*.png");
  eleventyConfig.addPassthroughCopy("android-*.png");
  eleventyConfig.addPassthroughCopy("ms-icon-*.png");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("site.webmanifest");

  eleventyConfig.addPlugin(pluginRss);

  // eleventyConfig.addPlugin(pageAssetsPlugin, {
  //   mode: "parse",
  //   postsMatching: "content/**/*.md",
  // });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // eleventyConfig.addPlugin(sitemap, {
  //   sitemap: {
  //     hostname: "https://andrewford.co.nz",
  //   },
  // });
};
