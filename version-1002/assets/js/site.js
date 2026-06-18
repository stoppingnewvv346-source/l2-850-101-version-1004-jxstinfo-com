(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      var open = mobilePanel.classList.toggle("is-open");
      mobilePanel.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  var hero = document.querySelector(".hero");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var nextButton = hero.querySelector(".hero-control.next");
    var prevButton = hero.querySelector(".hero-control.prev");

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startTimer();
      });
    });

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function (panel) {
    var container = panel.parentElement;
    var searchInput = panel.querySelector(".page-search");
    var yearSelect = panel.querySelector(".filter-year");
    var regionSelect = panel.querySelector(".filter-region");
    var clearButton = panel.querySelector(".clear-filters");
    var cards = Array.prototype.slice.call(container.querySelectorAll(".movie-card"));
    var empty = container.querySelector(".empty-state");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput && searchInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var shown = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-type")
        ].join(" "));
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchYear = !year || normalize(card.getAttribute("data-year")) === year;
        var matchRegion = !region || normalize(card.getAttribute("data-region")) === region;
        var visible = matchQuery && matchYear && matchRegion;

        card.style.display = visible ? "" : "none";

        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.style.display = shown ? "none" : "block";
      }
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");

      if (initialQuery) {
        searchInput.value = initialQuery;
      }

      searchInput.addEventListener("input", applyFilters);
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", applyFilters);
    }

    if (regionSelect) {
      regionSelect.addEventListener("change", applyFilters);
    }

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
        }

        if (yearSelect) {
          yearSelect.value = "";
        }

        if (regionSelect) {
          regionSelect.value = "";
        }

        applyFilters();
      });
    }

    applyFilters();
  });
})();
