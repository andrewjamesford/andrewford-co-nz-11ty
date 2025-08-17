const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
      throw new Error('LASTFM_API_KEY environment variable is not set');
    }

    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=${apiKey}&format=json`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Last.fm API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data || !data.recenttracks || !data.recenttracks.track) {
      throw new Error('Invalid response structure from Last.fm API');
    }

    const tracks = Array.isArray(data.recenttracks.track)
      ? data.recenttracks.track
      : [data.recenttracks.track];

    if (tracks.length === 0) {
      throw new Error('No recent tracks found');
    }

    const lastTrackData = tracks[0];

    if (!lastTrackData || !lastTrackData.artist || !lastTrackData.name) {
      throw new Error('Incomplete track data from Last.fm API');
    }

    const lastTrack = {
      artist: lastTrackData.artist?.['#text'] || 'Unknown Artist',
      trackName: lastTrackData.name || 'Unknown Track',
      album: lastTrackData.album?.['#text'] || 'Unknown Album',
      url: lastTrackData.url || '',
      albumArt: lastTrackData.image?.[1]?.['#text'] || '',
      albumArtLarge: lastTrackData.image?.[2]?.['#text'] || '',
    };

    res.json(lastTrack);
  } catch (error) {
    console.error('Last.fm API error:', error);
    res.status(500).json({ error_description: error.message });
  }
});

module.exports = router;