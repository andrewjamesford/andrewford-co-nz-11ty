import EleventyFetch from "@11ty/eleventy-fetch";
import { config } from "dotenv";

config();

export default async () => {
  try {
    const apiKey = process.env.LASTFM_API_KEY;

    // Skip fetching if credentials are missing or are mock/test values
    if (
      !apiKey ||
      apiKey.includes("mock") ||
      apiKey.includes("test") ||
      process.env.CI
    ) {
      console.log(
        "Skipping Last.fm API fetch (credentials missing or CI environment)"
      );
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

    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=${apiKey}&format=json`;
    console.log("Fetching latest music from Last.fm API");

    const data = await EleventyFetch(url, {
      duration: "1h", // save for 1 hour
      type: "json", // we'll parse JSON for you
      directory: "/tmp/.cache/", // API cache
      fetchOptions: {
        timeout: 10000, // 10 second timeout for the fetch
      },
    });

    if (!data || !data.recenttracks || !data.recenttracks.track) {
      console.error("Invalid response structure from Last.fm API");
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

    const tracks = Array.isArray(data.recenttracks.track)
      ? data.recenttracks.track
      : [data.recenttracks.track];

    if (tracks.length === 0) {
      console.log("No recent tracks found from Last.fm");
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

    const lastTrackData = tracks[0];

    return {
      music: {
        artist: lastTrackData.artist?.["#text"] || "Unknown Artist",
        trackName: lastTrackData.name || "Unknown Track",
        album: lastTrackData.album?.["#text"] || "Unknown Album",
        url: lastTrackData.url || "",
        albumArt: lastTrackData.image?.[1]?.["#text"] || "",
        albumArtLarge: lastTrackData.image?.[2]?.["#text"] || "",
      },
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
