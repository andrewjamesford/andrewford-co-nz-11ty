const loadData = async () => {
  const LAST_FM_WIDGET_ID = "lastFM";
  const LAST_FM_LINK_ID = "lastFMLink";
  const LAST_FM_IMG_ID = "lastFMImg";
  const LAST_FM_ALBUM_ID = "lastFMAlbum";
  const NETLIFY_FUNCTIONS_URL = `${CONFIG.SITE_URL}/.netlify/functions/lastplayed`;

  try {
    const lastFMLink = document.getElementById(LAST_FM_LINK_ID);
    const lastFMImg = document.getElementById(LAST_FM_IMG_ID);
    const lastFMSourceList = document.querySelectorAll(
      ".lastfm-widget picture source"
    );
    const lastFMAlbum = document.getElementById(LAST_FM_ALBUM_ID);
    const response = await fetch(NETLIFY_FUNCTIONS_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      lastFMLink.innerText = `${data.trackName} - ${data.artist}`;
      lastFMLink.href = data.url;

      if (data.albumArtLarge) {
        if (lastFMImg) {
          lastFMImg.src = data.albumArtLarge;
          lastFMImg.alt = `Album art for ${data.artist} - ${data.album}`;
        }
      }
      lastFMAlbum.innerText = data.album;

      if (data.albumArtLarge && lastFMSourceList.length !== 0) {
        for (const source of lastFMSourceList) {
          source.setAttribute("srcset", data.albumArtLarge);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

loadData();
