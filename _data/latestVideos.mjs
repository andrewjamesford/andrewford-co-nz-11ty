import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const baseUrl = "process.env.URL" || "http://localhost:9999"; // Fallback for local development
    const url = `${baseUrl}/.netlify/functions/latestUploads`;
    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you
      directory: "/tmp/.cache/", // Netlify Functions
    });

    return {
      videos: json,
    };
  } catch (e) {
    console.error("Error in latestVideos.mjs: " + e);
    return {
      videos: [],
    };
  }
};
