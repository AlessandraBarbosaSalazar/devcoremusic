const songs = [
  {
    title: "Time After Time",
    artist: "Ejae",
    src: "music/time-after-time.mp3",
    cover: "covers/timeaftertime.jpeg"
  },
  {
    title: "Time After Time",
    artist: "Ejae",
    src: "music/time-after-time.mp3",
    cover: "covers/timeaftertime.jpeg"
  }
];

let index = 0;
let shuffle = false;
let repeat = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");

function loadSong(i) {
  const song = songs[i];
  document.getElementById("title").innerText = song.title;
  document.getElementById("artist").innerText = song.artist;
  document.getElementById("cover").src = song.cover;
  document.getElementById("bgBlur").style.backgroundImage = `url('${song.cover}')`;
  audio.src = song.src;
  audio.volume = volumeSlider.value / 100;
}

function playPause() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

function next() {
  if (shuffle) {
    index = Math.floor(Math.random() * songs.length);
  } else {
    index = (index + 1) % songs.length;
  }
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸️";
}

function prev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸️";
}

function toggleShuffle() {
  shuffle = !shuffle;
  document.getElementById("shuffleBtn").classList.toggle("active", shuffle);
}

function toggleRepeat() {
  repeat = !repeat;
  document.getElementById("repeatBtn").classList.toggle("active", repeat);
}

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

audio.addEventListener("timeupdate", () => {
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.value = isNaN(pct) ? 0 : pct;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (repeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    next();
  }
});

progress.addEventListener("input", e => {
  audio.currentTime = (e.target.value / 100) * audio.duration;
});

volumeSlider.addEventListener("input", e => {
  audio.volume = e.target.value / 100;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

loadSong(index);
