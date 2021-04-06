const pluginRss = require("@11ty/eleventy-plugin-rss");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  
  eleventyConfig.addCollection("articles",
  collection => collection
  .getAllSorted()
  .filter(item => item.inputPath.startsWith('./content/articles/')));

  eleventyConfig.addCollection("archive",
  collection => collection
  .getAllSorted()
  .filter(item => item.inputPath.startsWith('./content/archive/')));

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("apple-touch-icon*.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: "parse",
    postsMatching: "content/**/*.md",
  });

  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://andrewford.co.nz",
    },
  });

};