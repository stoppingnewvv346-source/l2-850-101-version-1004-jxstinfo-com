(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (!toggle || !mobileNav) {
      return;
    }

    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  function initHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    if (slides.length <= 1) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        play();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    play();
  }

  function normalized(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    var roots = Array.prototype.slice.call(document.querySelectorAll('.js-filter-root'));

    roots.forEach(function (root) {
      var input = root.querySelector('[data-search-input]');
      var region = root.querySelector('[data-region-filter]');
      var type = root.querySelector('[data-type-filter]');
      var year = root.querySelector('[data-year-filter]');
      var reset = root.querySelector('[data-filter-reset]');
      var count = root.querySelector('[data-filter-count]');
      var empty = root.querySelector('[data-empty-state]');
      var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));

      function matches(card) {
        var query = normalized(input && input.value);
        var regionValue = normalized(region && region.value);
        var typeValue = normalized(type && type.value);
        var yearValue = normalized(year && year.value);
        var haystack = normalized([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-category')
        ].join(' '));

        if (query && haystack.indexOf(query) === -1) {
          return false;
        }

        if (regionValue && normalized(card.getAttribute('data-region')) !== regionValue) {
          return false;
        }

        if (typeValue && normalized(card.getAttribute('data-type')) !== typeValue) {
          return false;
        }

        if (yearValue && normalized(card.getAttribute('data-year')) !== yearValue) {
          return false;
        }

        return true;
      }

      function apply() {
        var visible = 0;
        cards.forEach(function (card) {
          var keep = matches(card);
          card.hidden = !keep;
          if (keep) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部 / 共 ' + cards.length + ' 部';
        }

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, region, type, year].forEach(function (control) {
        if (!control) {
          return;
        }
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      });

      if (reset) {
        reset.addEventListener('click', function () {
          if (input) {
            input.value = '';
          }
          if (region) {
            region.value = '';
          }
          if (type) {
            type.value = '';
          }
          if (year) {
            year.value = '';
          }
          apply();
        });
      }

      apply();
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.video-player[data-src]'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');
      var message = player.querySelector('[data-player-message]');
      var source = player.getAttribute('data-src');
      var hlsInstance = null;
      var attached = false;

      if (!video || !source) {
        return;
      }

      function setMessage(text) {
        if (message) {
          message.textContent = text;
        }
      }

      function attachSource() {
        if (attached) {
          return;
        }

        attached = true;
        setMessage('正在加载播放源…');

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage('播放源已就绪');
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage('视频加载失败，请稍后重试');
            }
          });
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.addEventListener('loadedmetadata', function () {
            setMessage('播放源已就绪');
          });
          return;
        }

        setMessage('当前浏览器不支持 HLS 播放，请更换浏览器再试');
      }

      function play() {
        attachSource();
        var playPromise = video.play();

        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(function () {
            player.classList.add('playing');
          }).catch(function () {
            setMessage('请再次点击播放按钮开始播放');
          });
          return;
        }

        player.classList.add('playing');
      }

      if (button) {
        button.addEventListener('click', play);
      }

      video.addEventListener('play', function () {
        player.classList.add('playing');
      });

      video.addEventListener('pause', function () {
        player.classList.remove('playing');
      });

      video.addEventListener('error', function () {
        setMessage('视频播放遇到错误，请检查网络或播放源');
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initNavigation();
    initHeroCarousel();
    initFilters();
    initPlayers();
  });
})();
