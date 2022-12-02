// const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  console.log("got here");
  // your server-side functionality
  try {
    const response = await fetch(
      "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=f338072e530795905234f1e21d33d5fa&format=json",
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

    //  console.log(lastTrack);
    return {
      statusCode: 200,
      body: JSON.stringify(lastTrack),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
