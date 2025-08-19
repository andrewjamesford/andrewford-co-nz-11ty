import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const baseUrl =
      process.env.API_URL || process.env.URL || "http://localhost:3010";
    console.log("Fetching latest videos from:", baseUrl);
    const url = `${baseUrl}/api/latestUploads`;
    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you
      directory: "/tmp/.cache/", // API cache
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
