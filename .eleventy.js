const fs = require("fs");
const htmlmin = require("html-minifier-terser");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const embedEverything = require("eleventy-plugin-embed-everything");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    useContext: true,
  });

  // Add navigation plugin
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(embedEverything, {
    use: ["soundcloud", "youtube"],
  });

  eleventyConfig.addFilter("date", function (date, format) {
    if (date == null) date = DateTime.now();
    else date = new Date(date);
    return date.toFormat(format);
  });

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addPassthroughCopy({ "src/media": "media" });
  eleventyConfig.addPassthroughCopy({ "src/brochures": "brochures" });
  eleventyConfig.addPassthroughCopy({
    "./node_modules/@fontsource/rubik/*.css": "@fontsource/rubik",
    "./node_modules/@fontsource/rubik/files/*.woff2": "@fontsource/rubik/files",
  });

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  // Collections
  eleventyConfig.addCollection("musicotherapie", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/musicotherapie/*.md");
  });
  eleventyConfig.addCollection("spectacles", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/spectacles/*.md");
  });
  eleventyConfig.addCollection("concerts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/concerts/*.md");
  });

  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  var pathPrefix = "";
  // if (process.env.GITHUB_REPOSITORY) {
  //   pathPrefix = process.env.GITHUB_REPOSITORY.split("/")[1];
  // }

  return {
    dir: {
      input: "src",
    },
    pathPrefix,
  };
};

function htmlminTransform(content, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}
