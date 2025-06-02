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
    async function imageShortcode(src, alt, widths = [320, 720, 1024]) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let file = relativeToInputPath(this.page.inputPath, src);
      let metadata = await eleventyImage(file, {
        widths: widths || [320, 720, 1024],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes:
          "(min-width: 1024px) 1024px, (min-width: 720px) 720px, (min-width: 320px) 320px, 100vw",
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
      widths = [320, 720, 1024],
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
        widths: widths || [320, 720, 1024],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes:
          "(min-width: 1024px) 1024px, (min-width: 720px) 720px, (min-width: 320px) 320px, 100vw",
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
    async function imageShortcode(src, alt, widths = [320, 720, 1024]) {
      // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
      // Warning: Avif can be resource-intensive so take care!
      let file = relativeToInputPath(this.page.inputPath, src);
      let metadata = await eleventyImage(file, {
        widths: widths || [320, 720, 1024],
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we're using addPlugin.
      });

      // TODO loading=eager and fetchpriority=high
      let imageAttributes = {
        alt,
        sizes:
          "(min-width: 1024px) 1024px, (min-width: 720px) 720px, (min-width: 320px) 320px, 100vw",
        loading: "lazy",
        decoding: "async",
      };
      const img = eleventyImage.generateHTML(metadata, imageAttributes);

      return `<figure class="figure">${img}<figcaption class="figure-caption">${alt}</figcaption></figure>`;
    }
  );

  // Advanced responsive picture shortcode
  eleventyConfig.addAsyncShortcode(
    "responsivePicture",
    async function responsivePictureShortcode(
      src,
      alt,
      widths = [320, 720, 1024],
      breakpoints = {
        mobile: 320,
        tablet: 720,
        desktop: 1024,
      }
    ) {
      let file = relativeToInputPath(this.page.inputPath, src);
      let metadata = await eleventyImage(file, {
        widths: widths,
        formats,
        outputDir: path.join(eleventyConfig.dir.output, "img"),
      });

      // Custom sizes attribute based on breakpoints
      const sizesArray = [
        `(min-width: ${breakpoints.desktop}px) ${breakpoints.desktop}px`,
        `(min-width: ${breakpoints.tablet}px) ${breakpoints.tablet}px`,
        `${breakpoints.mobile}px`,
      ];

      let imageAttributes = {
        alt,
        sizes: sizesArray.join(", "),
        loading: "lazy",
        decoding: "async",
      };

      return eleventyImage.generateHTML(metadata, imageAttributes);
    }
  );
};
