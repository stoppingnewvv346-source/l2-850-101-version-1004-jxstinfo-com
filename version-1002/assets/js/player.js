(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll(".player-box"));

  players.forEach(function (box) {
    var video = box.querySelector(".player-video");
    var overlay = box.querySelector(".player-overlay");
    var source = video ? video.getAttribute("data-stream") : "";
    var started = false;
    var hls = null;

    function attach() {
      if (!video || !source || started) {
        return;
      }

      started = true;
      box.classList.add("is-started");
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", attach);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          attach();
        }
      });

      video.addEventListener("ended", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
          hls = null;
        }
      });
    }
  });
})();
