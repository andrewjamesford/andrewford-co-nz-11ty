import path from "path";
import eleventyImage from "@11ty/eleventy-img";

export default (eleventyConfig) => {
  function relativeToInputPath(inputPath, relativeFilePath) {
    let split = inputPath.split("/");
    split.pop();

    return path.resolve(split.join(path.sep), relativeFilePath);
  }

  const formats = ["avif", "webp", "png", "auto"];

  // Eleventy Image shortcode
  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addAsyncShortcode(
    "image",
    async function imageShortcode(src, alt, widths = [320, 720, 1024, 1280]) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let file = relativeToInputPath(this.page.inputPath, src);
      let metadata = await eleventyImage(file, {
        widths: widths || [320, 720, 1024, 1280],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes: widths,
        loading: "lazy",
        decoding: "async",
      };
      return eleventyImage.generateHTML(metadata, imageAttributes);
    }
  );

  // Eleventy Image shortcode
  // https://www.11ty.dev/docs/plugins/image/
  eleventyConfig.addAsyncShortcode(
    "externalImage",
    async function externalImageShortcode(
      src,
      alt,
      widths = [320, 720, 1024, 1280],
      cssClass,
      id = "externalImage"
    ) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let srcUrl = src ? src : "";
      if (srcUrl === "") {
        return "";
      }

      let metadata = await eleventyImage(srcUrl, {
        widths: widths || [320, 720, 1024, 1280],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes: widths,
        loading: "lazy",
        decoding: "async",
        class: cssClass,
        id: id,
      };
      return eleventyImage.generateHTML(metadata, imageAttributes);
    }
  );

  eleventyConfig.addAsyncShortcode(
    "figure",
    async function imageShortcode(src, alt, widths = [320, 720, 1024, 1280]) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let file = relativeToInputPath(this.page.inputPath, src);
      let metadata = await eleventyImage(file, {
        widths: widths || [320, 720, 1024, 1280],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes: widths,
        loading: "lazy",
        decoding: "async",
      };
      const img = eleventyImage.generateHTML(metadata, imageAttributes);

      return `<figure class="figure">${img}<figcaption class="figure-caption">${alt}</figcaption></figure>`;
    }
  );
};
