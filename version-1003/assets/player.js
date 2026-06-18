(function () {
  function tryPlay(video) {
    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  function initMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var veil = document.getElementById(options.veilId);
    var started = false;
    var hls = null;

    if (!video || !button || !options.url) {
      return;
    }

    function hideCover() {
      button.classList.add("is-hidden");

      if (veil) {
        veil.classList.add("is-hidden");
      }
    }

    function attachAndPlay() {
      if (started) {
        tryPlay(video);
        return;
      }

      started = true;
      hideCover();

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.url;
        tryPlay(video);
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(options.url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          tryPlay(video);
        });
        return;
      }

      video.src = options.url;
      tryPlay(video);
    }

    button.addEventListener("click", attachAndPlay);
    video.addEventListener("click", function () {
      if (!started) {
        attachAndPlay();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
