// Import the node-fetch library
import fetch from "node-fetch";

exports.handler = async function (event, context) {
  try {
    // Get the LastFM API key from environment variables
    const apiKey = process.env.LASTFM_API_KEY;

    // Make a GET request to the LastFM API
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=${apiKey}&format=json`,
      {
        method: "GET",
      }
    );

    // Parse the response as JSON
    const data = await response.json();

    // Get the first track in the recent tracks array
    const lastTrackData = data.recenttracks.track[0];

    // Create an object with the relevant track information
    const lastTrack = {
      artist: lastTrackData.artist["#text"],
      trackName: lastTrackData.name,
      album: lastTrackData.album["#text"],
      url: lastTrackData.url,
      albumArt: lastTrackData.image[1]["#text"],
    };

    // Return the track information as a JSON string
    return {
      statusCode: 200,
      body: JSON.stringify(lastTrack),
    };
  } catch (error) {
    // If there is an error, return a 500 status code and the error message
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
