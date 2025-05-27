const EleventyFetch = require("@11ty/eleventy-fetch");
require("dotenv").config();

module.exports = async () => {
  try {
    const baseUrl = process.env.API_URL || "http://localhost:8888";
    console.log("Fetching latest music from:", baseUrl);
    const url = `${baseUrl}/.netlify/functions/lastplayed`;

    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we’ll parse JSON for you,
      directory: "/tmp/.cache/", // Netlify Functions
    });

    return {
      music: json,
    };
  } catch (e) {
    console.error("Error in latestMusic.js: " + e);
    return {
      music: [],
    };
  }
};
