const LAST_FM_WIDGET_ID = "lastFM";
const LAST_FM_LINK_ID = "lastFMLink";
const LAST_FM_IMG_ID = "lastFMImg";
const LAST_FM_ALBUM_ID = "lastFMAlbum";
const NETLIFY_FUNCTIONS_URL = "/.netlify/functions/lastplayed";

const loadData = async () => {
  try {
    const lastFMWidget = document.getElementById(LAST_FM_WIDGET_ID);
    const lastFMLink = document.getElementById(LAST_FM_LINK_ID);
    const lastFMImg = document.getElementById(LAST_FM_IMG_ID);
    const lastFMAlbum = document.getElementById(LAST_FM_ALBUM_ID);

    const response = await fetch(`/.netlify/functions/lastplayed`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      lastFMLink.innerText = `${data.trackName} - ${data.artist}`;
      lastFMLink.href = data.url;
      lastFMImg.src = data.albumArt;
      lastFMImg.width = 64;
      lastFMImg.height = 64;
      lastFMImg.alt = `Album art for ${data.artist} - ${data.album}`;
      lastFMAlbum.innerText = data.album;
      lastFMWidget.style = "display:grid";
    }
  } catch (error) {
    console.error(error);
  }
};

loadData();
