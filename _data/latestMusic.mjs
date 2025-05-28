import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const baseUrl = "process.env.URL" || "http://localhost:9999"; // Fallback for local development
    console.log("Fetching latest music from:", baseUrl);
    const url = `${baseUrl}/.netlify/functions/lastplayed`;

    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you,
      directory: "/tmp/.cache/", // Netlify Functions
    });

    return {
      music: json,
    };
  } catch (e) {
    console.error("Error in latestMusic.mjs: " + e);
    return {
      music: [],
    };
  }
};
