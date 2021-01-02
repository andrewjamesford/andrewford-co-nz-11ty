module.exports = function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.addCollection("articles",
      collection => collection
        .getAllSorted()
        .filter(item => item.inputPath.startsWith('./content/articles/')))

        eleventyConfig.addPassthroughCopy("css");
  };