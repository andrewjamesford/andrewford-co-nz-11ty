import fetch from "node-fetch";
import dotenv from "dotenv";

export const handler = async (event, context) => {
  dotenv.config();
  try {
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
      throw new Error("LASTFM_API_KEY environment variable is not set");
    }

    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=${apiKey}&format=json`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Last.fm API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check if the response has the expected structure
    if (!data || !data.recenttracks || !data.recenttracks.track) {
      throw new Error("Invalid response structure from Last.fm API");
    }

    // Handle case where track is an array vs single object
    const tracks = Array.isArray(data.recenttracks.track)
      ? data.recenttracks.track
      : [data.recenttracks.track];

    if (tracks.length === 0) {
      throw new Error("No recent tracks found");
    }

    const lastTrackData = tracks[0];

    // Validate that the track data has required fields
    if (!lastTrackData || !lastTrackData.artist || !lastTrackData.name) {
      throw new Error("Incomplete track data from Last.fm API");
    }

    const lastTrack = {
      artist: lastTrackData.artist?.["#text"] || "Unknown Artist",
      trackName: lastTrackData.name || "Unknown Track",
      album: lastTrackData.album?.["#text"] || "Unknown Album",
      url: lastTrackData.url || "",
      albumArt: lastTrackData.image?.[1]?.["#text"] || "",
      albumArtLarge: lastTrackData.image?.[2]?.["#text"] || "",
    };

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:8888", "https://andrewford.co.nz"];
    const origin = event.headers.origin;
    const allowOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify(lastTrack),
    };
  } catch (error) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:8888", "https://andrewford.co.nz"];
    const origin = event.headers?.origin;
    const allowOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
