import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const baseUrl =
      process.env.API_URL || process.env.URL || "http://localhost:3000";
    console.log("Fetching latest music from:", baseUrl);
    const url = `${baseUrl}/api/lastplayed`;

    const json = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you,
      directory: "/tmp/.cache/", // API cache
    });

    return {
      music: json,
    };
  } catch (e) {
    console.error("Error in latestMusic.mjs: " + e);
    return {
      music: {
        artist: "Unknown Artist",
        trackName: "Unknown Track",
        album: "Unknown Album",
        url: "",
        albumArt: "",
        albumArtLarge: "",
      },
    };
  }
};
