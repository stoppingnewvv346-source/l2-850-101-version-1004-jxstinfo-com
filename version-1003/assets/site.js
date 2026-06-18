(function () {
  var mobileButton = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.getElementById("heroSlider");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var input = document.querySelector("[data-filter-input]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilters() {
    var query = normalize(input && input.value);
    var year = normalize(yearFilter && yearFilter.value);
    var type = normalize(typeFilter && typeFilter.value);

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-title"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var cardType = normalize(card.getAttribute("data-type"));
      var visible = true;

      if (query && haystack.indexOf(query) === -1) {
        visible = false;
      }

      if (year && cardYear !== year) {
        visible = false;
      }

      if (type && cardType !== type) {
        visible = false;
      }

      card.classList.toggle("is-hidden-card", !visible);
    });
  }

  [input, yearFilter, typeFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });
})();
