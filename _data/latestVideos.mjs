import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";
import fs from "fs/promises";
import path from "path";

config();

const CACHE_DIR = "./public/images/youtube-cache";
const PLACEHOLDER_PATH = "/images/video-placeholder.svg";

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    // Directory may already exist
  }
}

async function cacheThumbnail(videoId, thumbnailUrl) {
  if (!thumbnailUrl) {
    return PLACEHOLDER_PATH;
  }

  const outputPath = path.join(CACHE_DIR, `${videoId}.jpg`);

  try {
    const buffer = await EleventyFetch(thumbnailUrl, {
      duration: "1d",
      type: "buffer",
      directory: "/tmp/.cache/yt-thumbs/",
      fetchOptions: {
        timeout: 10000,
      },
    });

    await fs.writeFile(outputPath, buffer);
    return `/images/youtube-cache/${videoId}.jpg`;
  } catch (error) {
    console.error(`Failed to cache thumbnail for ${videoId}: ${error.message}`);
    return PLACEHOLDER_PATH;
  }
}

export default async () => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // Skip fetching if credentials are missing or are mock/test values
    if (
      !apiKey ||
      !channelId ||
      apiKey.includes("mock") ||
      channelId.includes("mock") ||
      apiKey.includes("test") ||
      channelId.includes("test")
    ) {
      console.log("Skipping YouTube API fetch (credentials missing or mock)");
      return { videos: [] };
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`;
    console.log("Fetching latest videos from YouTube API");

    const data = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you
      directory: "/tmp/.cache/", // API cache
      fetchOptions: {
        timeout: 10000, // 10 second timeout for the fetch
      },
    });

    if (!data || !data.items) {
      console.error("Invalid response structure from YouTube API");
      return { videos: [] };
    }

    // Ensure cache directory exists
    await ensureCacheDir();

    // Download and cache thumbnails, adding local paths to video objects
    const videosWithCachedThumbs = await Promise.all(
      data.items.map(async (video) => {
        const videoId = video.id.videoId;
        const thumbnailUrl = video.snippet?.thumbnails?.medium?.url;
        const localThumbnailPath = await cacheThumbnail(videoId, thumbnailUrl);

        return {
          ...video,
          localThumbnailPath,
        };
      })
    );

    return {
      videos: videosWithCachedThumbs,
    };
  } catch (e) {
    console.error("Error in latestVideos.mjs: " + e);
    return {
      videos: [],
    };
  }
};
