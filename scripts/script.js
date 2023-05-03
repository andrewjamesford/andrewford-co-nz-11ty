const loadData = async () => {
  const lastFMWidget = document.getElementById("lastFM");
  const lastFMLink = document.getElementById("lastFMLink");
  const lastFMImg = document.getElementById("lastFMImg");
  const lastFMAlbum = document.getElementById("lastFMAlbum");
  const response = await fetch(`/.netlify/functions/lastplayed`, {
    method: "GET",
  });
  if (response && response.status === 200) {
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
  }
};

loadData();
