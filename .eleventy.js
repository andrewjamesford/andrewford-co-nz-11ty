const pluginRss = require("@11ty/eleventy-plugin-rss");
// const pageAssetsPlugin = require("eleventy-plugin-page-assets");
// const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
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

const figureShortCode = async (
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
  const img = Image.generateHTML(imageMetadata, imageAttributes);
  
  return `<figure class="figure">${img}<figcaption class="figure-caption">${alt}</figcaption></figure>`;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // Create our custom markdown-it instance.
  let md = markdownIt({
    html: true,
    linkify: true,
  }).use(require("markdown-it-footnote"));

  // Create custom footnote block rule
  md.renderer.rules.footnote_block_open = () => (
    '<hr />\n' +
    '<h4 class="footnotes-title">References</h4>\n' +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n'
  );

  // Replacement render_footnote_caption with no [] around the number
  const render_footnote_caption = (tokens, idx) => {
    var n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) {
      n += ':' + tokens[idx].meta.subId;
    }
    return n;
  }
  
  // Replace existing function with one with no []
  md.renderer.rules.footnote_caption = (tokens, idx) => render_footnote_caption(tokens, idx)

  // Overwrite the built-in Markdown library with our custom instance.
  eleventyConfig.setLibrary("md", md);

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
  eleventyConfig.addShortcode("figure", figureShortCode);

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
  eleventyConfig.addPassthroughCopy("*.txt");

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
