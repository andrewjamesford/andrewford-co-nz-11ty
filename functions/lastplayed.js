import fetch from "node-fetch";

exports.handler = async function (event, context) {
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
    };

    return {
      statusCode: 200,
      body: JSON.stringify(lastTrack),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: error.message }),
    };
  }
};
