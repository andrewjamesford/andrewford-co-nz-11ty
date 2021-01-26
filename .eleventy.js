const pluginRss = require("@11ty/eleventy-plugin-rss");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');

module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  
  eleventyConfig.addCollection("articles",
  collection => collection
  .getAllSorted()
  .filter(item => item.inputPath.startsWith('./content/articles/')));

  eleventyConfig.addPassthroughCopy("css","images","assets");
  
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPlugin(pageAssetsPlugin, {
    mode: "parse",
    postsMatching: "content/**/*.md",
  });

};