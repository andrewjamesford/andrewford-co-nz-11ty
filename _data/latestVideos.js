const EleventyFetch = require("@11ty/eleventy-fetch");
require("dotenv").config();

module.exports = async () => {
  try {
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/.netlify/functions/latestUploads`;
    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we’ll parse JSON for you
      directory: "/tmp/.cache/", // Netlify Functions
    });

    return {
      videos: json,
    };
  } catch (e) {
    console.log(e);
    return {
      videos: [],
    };
  }
};
