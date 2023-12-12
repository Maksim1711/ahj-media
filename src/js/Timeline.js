export default class Timeline {
  constructor() {
    this.container = document.querySelector("#root");
    this.post = document.createElement("div");
    this.timer = document.createElement("span");
  }
  init() {
    this.subscribeEvents();
  }
  subscribeEvents() {
    this.addStopwatch();
    this.timer.classList.add("time");
    this.container.querySelector(".form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.post = document.createElement("div");
      this.post.classList.add("post");
      this.post.textContent = this.container
        .querySelector(".form")
        .querySelector("input").value;
      this.container
        .querySelector(".content")
        .insertAdjacentElement("beforeend", this.post);
      this.container.querySelector(".form").querySelector("input").value = "";
      this.getGeolocation();
    });
    this.container
      .querySelector(".modal__form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.container.querySelector(".modal__form").checkVisibility()) {
          const coordinates = document.createElement("div");
          coordinates.classList.add("coordinates");
          coordinates.textContent = this.container
            .querySelector(".modal__form")
            .querySelector("input").value;
          this.post.insertAdjacentElement("beforeend", coordinates);
          this.container
            .querySelector(".modal__form")
            .querySelector("input").value = "";
          this.showModal();
        }
      });
    this.container
      .querySelector(".modal__form")
      .querySelector(".btn_reset")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.showModal();
      });

    this.container
      .querySelector(".btn__audio")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.container.querySelector(".btn__video").classList.remove("active");
        this.container
          .querySelector(".btn__audio_stop")
          .classList.add("active");
        this.recordAudio();
      });
    this.container
      .querySelector(".btn__video")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.container.querySelector(".btn__audio").classList.remove("active");
        this.container
          .querySelector(".btn__video_stop")
          .classList.add("active");
        this.container.querySelector(".btn__video").classList.add("record");
        this.recordVideo();
      });
  }
  showModal() {
    this.container
      .querySelector(".modal__container")
      .classList.toggle("active");
    this.container.querySelector(".modal__content").classList.toggle("active");
  }
  addStopwatch() {
    let startBtnAudio = document.querySelector(".btn__audio");
    let startBtnVideo = document.querySelector(".btn__video");
    let resetBtnAudio = document.querySelector(".btn__audio_stop");
    let resetBtnVideo = document.querySelector(".btn__video_stop");
    let seconds = 0;
    let minutes = 0;
    let interval;
    startBtnAudio.addEventListener("click", () => {
      startBtnAudio.insertAdjacentElement("afterend", this.timer);
      interval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
          minutes++;
          seconds = 0;
        }
        if (minutes === 60) {
          //  hours++;
          minutes = 0;
        }
        this.timer.textContent = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }, 1000);
    });
    startBtnVideo.addEventListener("click", () => {
      startBtnVideo.insertAdjacentElement("afterend", this.timer);
      interval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
          minutes++;
          seconds = 0;
        }
        if (minutes === 60) {
          //  hours++;
          minutes = 0;
        }
        this.timer.textContent = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }, 1000);
    });
    resetBtnAudio.addEventListener("click", () => {
      clearInterval(interval);
      seconds = 0;
      minutes = 0;
      // hours = 0;
      this.timer.textContent = "";
      this.timer.remove();
    });
    resetBtnVideo.addEventListener("click", () => {
      clearInterval(interval);
      seconds = 0;
      minutes = 0;
      // hours = 0;
      this.timer.textContent = "";
      this.timer.remove();
    });
  }
  getGeolocation() {
    const success = (position) => {
      const { longitude, latitude } = position.coords;
      const coordinates = document.createElement("div");
      coordinates.classList.add("coordinates");
      coordinates.textContent = `${longitude}, ${latitude}`;
      this.post.insertAdjacentElement("beforeend", coordinates);
    };
    const error = () => {
      this.showModal();
    };
    if (!navigator.geolocation) {
      throw new Error("Ваш браузер не дружит с геолокацией...");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }
  async recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const audioPlayer = document.createElement("audio");
    audioPlayer.controls = true;
    const audioStop = this.container.querySelector(".btn__audio_stop");
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      this.container.querySelector(".btn__audio").classList.add("record");
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      audioPlayer.src = URL.createObjectURL(blob);
      this.container.querySelector(".btn__audio").classList.remove("record");
      this.post = document.createElement("div");
      this.post.classList.add("post");
      this.post.insertAdjacentElement("beforeend", audioPlayer);
      this.getGeolocation();
      this.container.querySelector(".btn__video").classList.add("active");
      this.container
        .querySelector(".btn__audio_stop")
        .classList.remove("active");
      this.container
        .querySelector(".content")
        .insertAdjacentElement("beforeend", this.post);
    });

    recorder.start();

    audioStop.addEventListener("click", () => {
      if (this.container.querySelector(".btn__audio.active")) {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }
    });
  }
  async recordVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const videoPlayer = document.createElement("video");
    videoPlayer.controls = true;
    const videoStop = this.container.querySelector(".btn__video_stop");
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      console.log("start");
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      videoPlayer.src = URL.createObjectURL(blob);
      this.container.querySelector(".btn__video").classList.remove("record");
      this.post = document.createElement("div");
      this.post.classList.add("post");
      this.post.insertAdjacentElement("beforeend", videoPlayer);
      this.getGeolocation();
      this.container.querySelector(".btn__audio").classList.add("active");
      this.container
        .querySelector(".btn__video_stop")
        .classList.remove("active");
      this.container
        .querySelector(".content")
        .insertAdjacentElement("beforeend", this.post);
    });
    recorder.start();
    videoStop.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  }
}
