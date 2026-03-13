const LAST_FM_WIDGET_ID = "lastFM";

const loadData = async () => {
  const LAST_FM_LINK_ID = "lastFMLink";
  const LAST_FM_IMG_ID = "lastFMImg";
  const LAST_FM_ALBUM_ID = "lastFMAlbum";
  const API_URL = `${CONFIG.API_URL}/api/lastplayed`;

  try {
    const lastFMLink = document.getElementById(LAST_FM_LINK_ID);
    const lastFMImg = document.getElementById(LAST_FM_IMG_ID);
    const lastFMAlbum = document.getElementById(LAST_FM_ALBUM_ID);
    const response = await fetch(API_URL, {
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
          lastFMImg.style.display = "block";

          const lastFMPlaceholder =
            document.getElementById("lastFMPlaceholder");
          if (lastFMPlaceholder) {
            lastFMPlaceholder.style.display = "none";
          }
        }
      }
      lastFMAlbum.innerText = data.album;
    }
  } catch (error) {
    const isLocalDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const isNetworkFailure =
      error instanceof TypeError &&
      error.message &&
      error.message.includes("Failed to fetch");

    if (isLocalDevelopment && isNetworkFailure) {
      console.error(
        `Unable to reach the local API server at ${CONFIG.API_URL}. Start both servers with "npm run dev", or run "npm run api:dev" alongside the 11ty UI server.`
      );
      return;
    }

    console.error(error);
  }
};

// Only run loadData when the DOM is loaded and the lastFM element exists
document.addEventListener("DOMContentLoaded", () => {
  const lastFMWidget = document.getElementById(LAST_FM_WIDGET_ID);
  if (lastFMWidget) {
    loadData();
  }
});
