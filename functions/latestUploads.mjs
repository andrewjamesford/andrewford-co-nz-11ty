import fetch from "node-fetch";
import dotenv from "dotenv";

// Changed from exports.handler to ES module export
export const handler = async (event, context) => {
  dotenv.config();
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // Documentation
    // https://developers.google.com/youtube/v3/docs/search

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    const lastUploadData = data.items;

    return {
      statusCode: 200,
      body: JSON.stringify(lastUploadData),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
