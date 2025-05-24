const LAST_FM_WIDGET_ID = "lastFM";
const LAST_FM_LINK_ID = "lastFMLink";
const LAST_FM_IMG_ID = "lastFMImg";
const LAST_FM_ALBUM_ID = "lastFMAlbum";
const NETLIFY_FUNCTIONS_URL = "/.netlify/functions/lastplayed";
const SITE_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:8888" // or your local dev port
    : location.origin;

const loadData = async () => {
  try {
    const lastFMLink = document.getElementById(LAST_FM_LINK_ID);
    const lastFMImg = document.getElementById(LAST_FM_IMG_ID);
    const lastFMSourceList = document.querySelectorAll(
      ".lastfm-widget picture source"
    );
    const lastFMAlbum = document.getElementById(LAST_FM_ALBUM_ID);
    const response = await fetch(SITE_URL + NETLIFY_FUNCTIONS_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      lastFMLink.innerText = `${data.trackName} - ${data.artist}`;
      lastFMLink.href = data.url;

      lastFMImg.src = `/images/vinyl.webp`;
      lastFMImg.alt = `Vinyl for ${data.artist} - ${data.album}`;
      console.log(data.albumArtLarge);
      if (!data.albumArtLarge) {
        lastFMImg.src = data.albumArtLarge;
        lastFMImg.alt = `Album art for ${data.artist} - ${data.album}`;
      } else {
      }
      lastFMAlbum.innerText = data.album;
      for (const source of lastFMSourceList) {
        source.setAttribute("srcset", data.albumArtLarge);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

loadData();
