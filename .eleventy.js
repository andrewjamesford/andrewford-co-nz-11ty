const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  
  eleventyConfig.addCollection("articles",
  collection => collection
  .getAllSorted()
  .filter(item => item.inputPath.startsWith('./content/articles/')));

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  
  eleventyConfig.addPlugin(pluginRss);

};