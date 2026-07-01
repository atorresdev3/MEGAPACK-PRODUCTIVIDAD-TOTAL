    function setupDragCarousel(carousel, track, speed) {
    if (!carousel || !track) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    let posX = 0;
    let setWidth = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragStartPos = 0;
    let directionLock = null;
    const autoScrollSpeed = prefersReducedMotion ? 0 : speed;
    const LOCK_THRESHOLD = 6;

    function getSetWidth() {
        return track.scrollWidth / 2;
    }

    function wrap(value) {
        if (setWidth <= 0) return value;
        return ((value % setWidth) + setWidth) % setWidth;
    }

    function updateTransform() {
        track.style.transform = `translateX(${-posX}px)`;
    }

    function tick() {
        if (!isDragging) {
        posX = wrap(posX + autoScrollSpeed);
        updateTransform();
        }
        requestAnimationFrame(tick);
    }

    function onPointerDown(e) {
        if (e.pointerType !== "mouse") return;
        isDragging = true;
        startX = e.clientX;
        dragStartPos = posX;
    }

    function onPointerMove(e) {
        if (e.pointerType !== "mouse" || !isDragging) return;
        const delta = startX - e.clientX;
        posX = wrap(dragStartPos + delta);
        updateTransform();
    }

    function onPointerUp(e) {
        if (e.pointerType !== "mouse") return;
        isDragging = false;
    }

    carousel.addEventListener("pointerdown", onPointerDown);
    carousel.addEventListener("pointermove", onPointerMove);
    carousel.addEventListener("pointerup", onPointerUp);
    carousel.addEventListener("pointercancel", onPointerUp);
    carousel.addEventListener("pointerleave", onPointerUp);

    function onTouchStart(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        dragStartPos = posX;
        directionLock = null;
        isDragging = false;
    }

    function onTouchMove(e) {
        const touch = e.touches[0];
        const deltaX = startX - touch.clientX;
        const deltaY = startY - touch.clientY;

        if (!directionLock) {
        if (
            Math.abs(deltaX) < LOCK_THRESHOLD &&
            Math.abs(deltaY) < LOCK_THRESHOLD
        )
            return;
        directionLock =
            Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
        if (directionLock === "horizontal") isDragging = true;
        }

        if (directionLock === "horizontal") {
        e.preventDefault();
        posX = wrap(dragStartPos + deltaX);
        updateTransform();
        }
    }

    function onTouchEnd() {
        isDragging = false;
        directionLock = null;
    }

    carousel.addEventListener("touchstart", onTouchStart, { passive: true });
    carousel.addEventListener("touchmove", onTouchMove, { passive: false });
    carousel.addEventListener("touchend", onTouchEnd);
    carousel.addEventListener("touchcancel", onTouchEnd);

    window.addEventListener("resize", () => {
        setWidth = getSetWidth();
    });

    setWidth = getSetWidth();
    requestAnimationFrame(tick);
    }

    document.addEventListener("DOMContentLoaded", () => {
    setupDragCarousel(
        document.querySelector(".hero__carousel"),
        document.querySelector(".hero__track"),
        1.5,
    );
    });

    window.addEventListener("load", () => {
    setupDragCarousel(
        document.querySelector(".testimonials__carousel"),
        document.querySelector(".testimonials__track"),
        0.9,
    );
    });

    document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".social-proof .stat-card");
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    function formatNumber(value, format) {
        const rounded = Math.round(value);
        if (format === "comma") {
        return rounded.toLocaleString("en-US");
        }
        return rounded.toString();
    }

    function animateCount(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const format = el.dataset.format || "";

        if (prefersReducedMotion) {
        el.textContent = formatNumber(target, format) + suffix;
        return;
        }

        const duration = 1800;
        const startTime = performance.now();

        function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = formatNumber(current, format) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
        }

        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            const card = entry.target;
            card.classList.add("is-visible");

            const numberEl = card.querySelector(".stat-card__number");
            if (numberEl) animateCount(numberEl);

            obs.unobserve(card); 
            }
        });
        },
        { threshold: 0.4 }, 
    );

    cards.forEach((card) => observer.observe(card));
    });



        document.addEventListener("DOMContentLoaded", () => {
        const stepCards = document.querySelectorAll(".step-card");
        if (!stepCards.length) return;

        const observer = new IntersectionObserver(
            (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
                }
            });
            },
            { threshold: 0.3 },
        );

        stepCards.forEach((card) => observer.observe(card));
        });



    document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq__item");
    if (!faqItems.length) return;

    function closeItem(item) {
        const button = item.querySelector(".faq__question");
        const wrapper = item.querySelector(".faq__answer-wrapper");
        button.setAttribute("aria-expanded", "false");
        wrapper.classList.remove("is-open");
        wrapper.style.maxHeight = "0px";
    }

    function openItem(item) {
        const button = item.querySelector(".faq__question");
        const wrapper = item.querySelector(".faq__answer-wrapper");
        button.setAttribute("aria-expanded", "true");
        wrapper.classList.add("is-open");
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
    }

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq__question");

        button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";

        // cierra todas (solo una abierta a la vez)
        faqItems.forEach((otherItem) => closeItem(otherItem));

        if (!isOpen) {
            openItem(item);
        }
        });
    });

    window.addEventListener("resize", () => {
        faqItems.forEach((item) => {
        const wrapper = item.querySelector(".faq__answer-wrapper");
        if (wrapper.classList.contains("is-open")) {
            wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        }
        });
    });
    });



        document.addEventListener("DOMContentLoaded", () => {
        const priceEl = document.querySelector(".offer-card__price-amount");
        const priceWrapper = document.querySelector(".offer-card__price");
        if (!priceEl || !priceWrapper) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const start = parseFloat(priceEl.dataset.start);
        const end = parseFloat(priceEl.dataset.end);
        let hasAnimated = false;

        function setValue(value) {
            priceEl.textContent = "$" + value.toFixed(2);
        }

    function runCountdown() {
    const duration = 4000;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start - (start - end) * eased;
        setValue(current);
        if (progress < 1) {
        requestAnimationFrame(step);
        } else {
        setValue(end);
        priceWrapper.classList.add("is-urgent"); 
        }
    }

    requestAnimationFrame(step);
    }
        function trigger() {
            if (hasAnimated) return;
            hasAnimated = true;

            if (prefersReducedMotion) {
            setValue(end);
            return;
            }

            priceEl.classList.add("is-shaking");
            setTimeout(() => {
            priceEl.classList.remove("is-shaking");
            runCountdown();
            }, 1000); 
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                trigger();
                obs.unobserve(entry.target);
                }
            });
            },
            { threshold: 0.4 },
        );

        observer.observe(priceWrapper);
        });


    document.addEventListener("DOMContentLoaded", () => {
    const revealCards = document.querySelectorAll(".compare-card, .fit-card");
    if (!revealCards.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
            }
        });
        },
        { threshold: 0.3 },
    );

    revealCards.forEach((card) => observer.observe(card));
    });