(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            const open = mainNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let currentSlide = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === currentSlide);
        });
    }

    function startSlider() {
        if (slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            window.clearInterval(timer);
            showSlide(index);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();

    const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
        const container = panel.parentElement;
        const keyword = panel.querySelector(".filter-keyword");
        const year = panel.querySelector(".filter-year");
        const region = panel.querySelector(".filter-region");
        const form = panel.querySelector(".filter-form");
        const cards = Array.from(container.querySelectorAll(".movie-card"));
        const empty = container.querySelector(".empty-state");

        function applyFilter() {
            const keywordValue = (keyword && keyword.value ? keyword.value : "").trim().toLowerCase();
            const yearValue = year && year.value ? year.value : "";
            const regionValue = region && region.value ? region.value : "";
            let shown = 0;

            cards.forEach(function (card) {
                const text = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(" ").toLowerCase();
                const passKeyword = !keywordValue || text.indexOf(keywordValue) !== -1;
                const passYear = !yearValue || card.dataset.year === yearValue;
                const passRegion = !regionValue || card.dataset.region === regionValue;
                const visible = passKeyword && passYear && passRegion;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                applyFilter();
            });
            form.addEventListener("reset", function () {
                window.setTimeout(applyFilter, 0);
            });
        }
        [keyword, year, region].forEach(function (field) {
            if (field) {
                field.addEventListener("input", applyFilter);
                field.addEventListener("change", applyFilter);
            }
        });

        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query && keyword) {
            keyword.value = query;
            applyFilter();
        }
    });
})();
