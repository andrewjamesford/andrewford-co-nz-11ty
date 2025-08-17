import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey) {
      throw new Error("YOUTUBE_API_KEY environment variable is not set");
    }

    if (!channelId) {
      throw new Error("YOUTUBE_CHANNEL_ID environment variable is not set");
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data || !data.items) {
      throw new Error("Invalid response structure from YouTube API");
    }

    const lastUploadData = data.items;

    res.json(lastUploadData);
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ error_description: error.message });
  }
});

export default router;
