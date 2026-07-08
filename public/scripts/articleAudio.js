(function () {
  const players = document.querySelectorAll("[data-audio-player]");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const roundedSeconds = Math.floor(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = String(roundedSeconds % 60).padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }

  players.forEach((player) => {
    const audio = player.querySelector("audio");
    const playButton = player.querySelector("[data-audio-play]");
    const playIcon = player.querySelector("[data-audio-play-icon]");
    const progress = player.querySelector("[data-audio-progress]");
    const currentTime = player.querySelector("[data-audio-current]");
    const totalTime = player.querySelector("[data-audio-total]");
    const speed = player.querySelector("[data-audio-speed]");

    if (!audio || !playButton || !progress || !currentTime || !totalTime) {
      return;
    }

    player.classList.add("article-audio-enhanced");
    audio.controls = false;
    progress.value = 0;

    const setPlayingState = (isPlaying) => {
      playButton.setAttribute(
        "aria-label",
        isPlaying
          ? "Pause Listen to this article"
          : "Play Listen to this article",
      );
      playIcon.textContent = isPlaying ? "❚❚" : "▶";
    };

    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) {
        totalTime.textContent = formatTime(audio.duration);
      } else if (player.dataset.audioDuration) {
        totalTime.textContent = player.dataset.audioDuration;
      }
    };

    const updateProgress = () => {
      currentTime.textContent = formatTime(audio.currentTime);

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String((audio.currentTime / audio.duration) * 100);
        progress.setAttribute(
          "aria-valuetext",
          `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}`,
        );
      }
    };

    playButton.addEventListener("click", async () => {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    });

    progress.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }

      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
      updateProgress();
    });

    if (speed) {
      speed.addEventListener("change", () => {
        audio.playbackRate = Number(speed.value);
      });
    }

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", () => setPlayingState(true));
    audio.addEventListener("pause", () => setPlayingState(false));
    audio.addEventListener("ended", () => {
      setPlayingState(false);
      progress.value = 0;
    });

    updateDuration();
    updateProgress();
    setPlayingState(false);
  });
})();
