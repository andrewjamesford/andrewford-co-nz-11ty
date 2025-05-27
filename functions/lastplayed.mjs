import fetch from "node-fetch";
import dotenv from "dotenv";

export const handler = async (event, context) => {
  dotenv.config();
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=${apiKey}&format=json`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    const lastTrackData = data.recenttracks.track[0];
    const lastTrack = {
      artist: lastTrackData.artist["#text"],
      trackName: lastTrackData.name,
      album: lastTrackData.album["#text"],
      url: lastTrackData.url,
      albumArt: lastTrackData.image[1]["#text"],
      albumArtLarge: lastTrackData.image[2]["#text"],
    };

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["https://andrewford.co.nz"];
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
