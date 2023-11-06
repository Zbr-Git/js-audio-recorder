const mic_btn = document.querySelector("#mic"); // btn>span
const playback = document.querySelector(".playback"); // audio tag

mic_btn.addEventListener("click", ToggleMic);

let can_record = false;
let is_recording = false;

let recorder = null;

let chunks = [];

function SetupAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(SetupStream)
      .catch((err) => {
        console.error(err);
      });
  }
}

SetupAudio();

function SetupStream(stream) {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = (e) => {
    const blob = new Blob(chunks, { type: "audio/mp3; codecs=opus" });
    chunks = [];
    const audioUrl = window.URL.createObjectURL(blob);
    playback.src = audioUrl;
  };

  can_record = true;
}

function ToggleMic() {
  if (!can_record) return;
  is_recording = !is_recording;

  if (is_recording) {
    recorder.start();
    mic_btn.classList.add("is-recording");
  } else {
    recorder.stop();
    mic_btn.classList.remove("is-recording");
  }
}
