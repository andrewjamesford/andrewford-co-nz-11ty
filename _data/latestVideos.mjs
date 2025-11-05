import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey) {
      console.error("YOUTUBE_API_KEY environment variable is not set");
      return { videos: [] };
    }

    if (!channelId) {
      console.error("YOUTUBE_CHANNEL_ID environment variable is not set");
      return { videos: [] };
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`;
    console.log("Fetching latest videos from YouTube API");

    const data = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you
      directory: "/tmp/.cache/", // API cache
    });

    if (!data || !data.items) {
      console.error("Invalid response structure from YouTube API");
      return { videos: [] };
    }

    return {
      videos: data.items,
    };
  } catch (e) {
    console.error("Error in latestVideos.mjs: " + e);
    return {
      videos: [],
    };
  }
};
