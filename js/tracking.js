    (function () {
    "use strict";

    if (typeof window.__MM_track !== "function") {
        console.warn("[MM Tracking] Pixel core no encontrado. Abortando.");
        return;
    }

    const startTime = Date.now(); 
    let activeTime = 0; 
    let lastActiveTimestamp = Date.now(); 
    let isPageVisible = true; 
    let idleTimer = null; 
    let isIdle = false; 
    let firstScrollDone = false; 
    let ctaHoverCount = 0;
    let ofertaSeenTime = null; 

    const fired = {
        scrollMilestones: { 25: false, 50: false, 75: false, 90: false },
        timeCheckpoints: { 30: false, 60: false, 120: false, 180: false },
        sections: {},
        highEngagement: false,
        exitIntent: false,
        textSelection: false,
        copyAction: false,
        idleDetected: false,
        returnVisitor: false,
    };

    window.__MM_track("ViewContent", {
        content_name: "Megapack Productividad Total",
        content_category: "Plantillas Digitales",
        content_ids: ["megapack-productividad"],
        content_type: "product",
        currency: "USD",
        value: 4.9,
    });

    try {
        const visitKey = "mm_megapack_visited";
        const previousVisit = localStorage.getItem(visitKey);

        if (previousVisit) {
        const daysSince = Math.floor(
            (Date.now() - parseInt(previousVisit)) / (1000 * 60 * 60 * 24),
        );

        window.__MM_track("ReturnVisitor", {
            content_name: "Megapack Productividad Total",
            days_since_last_visit: daysSince,
            visit_recency:
            daysSince === 0 ? "same_day" : daysSince <= 3 ? "recent" : "delayed",
        });

        fired.returnVisitor = true;
        }

        localStorage.setItem(visitKey, Date.now().toString());
    } catch (e) {
    }

    function onFirstScroll() {
        if (firstScrollDone) return;
        firstScrollDone = true;

        const secondsToFirstScroll = Math.floor((Date.now() - startTime) / 1000);

        window.__MM_track("TimeToFirstScroll", {
        content_name: "Megapack Productividad Total",
        seconds: secondsToFirstScroll,
        engagement_level:
            secondsToFirstScroll <= 3
            ? "instant" 
            : secondsToFirstScroll <= 8
                ? "normal" 
                : "slow",
        });

        window.removeEventListener("scroll", onFirstScroll);
    }

    window.addEventListener("scroll", onFirstScroll, { passive: true });

    function getScrollPercent() {
        const el = document.documentElement;
        const top = window.scrollY || el.scrollTop;
        const height = el.scrollHeight - el.clientHeight;
        return height > 0 ? Math.round((top / height) * 100) : 0;
    }

    let lastScrollY = 0;
    let lastScrollTime = Date.now();
    let scrollSpeeds = []; 

    window.addEventListener(
        "scroll",
        function () {
        const pct = getScrollPercent();
        const now = Date.now();
        const currentY = window.scrollY;

        const timeDelta = (now - lastScrollTime) / 1000;
        if (timeDelta > 0) {
            const speed = Math.abs(currentY - lastScrollY) / timeDelta;
            scrollSpeeds.push(speed);
            // Guardamos solo las últimas 10 mediciones
            if (scrollSpeeds.length > 10) scrollSpeeds.shift();
        }

        lastScrollY = currentY;
        lastScrollTime = now;

        // ── Disparar milestone de scroll ──
        [25, 50, 75, 90].forEach(function (milestone) {
            if (!fired.scrollMilestones[milestone] && pct >= milestone) {
            fired.scrollMilestones[milestone] = true;

            const avgSpeed =
                scrollSpeeds.length > 0
                ? Math.round(
                    scrollSpeeds.reduce((a, b) => a + b, 0) / scrollSpeeds.length,
                    )
                : 0;

            window.__MM_track("ScrollDepth", {
                content_name: "Megapack Productividad Total",
                scroll_depth: milestone,
                avg_scroll_speed: avgSpeed,
                scroll_behavior:
                avgSpeed < 200
                    ? "slow_reader"
                    : avgSpeed < 500
                    ? "normal"
                    : "fast_scanner",
                time_to_reach_seconds: Math.floor((Date.now() - startTime) / 1000),
            });

            if (milestone === 90) {
                window.__MM_track("DeepScroll", {
                content_name: "Megapack Productividad Total",
                label: "leyo_casi_todo",
                total_time_seconds: Math.floor((Date.now() - startTime) / 1000),
                });
            }
            }
        });
        },
        { passive: true },
    );


    const timeInterval = setInterval(function () {
        const seconds = Math.floor((Date.now() - startTime) / 1000);

        [30, 60, 120, 180].forEach(function (checkpoint) {
        if (!fired.timeCheckpoints[checkpoint] && seconds >= checkpoint) {
            fired.timeCheckpoints[checkpoint] = true;

            window.__MM_track("TimeOnPage", {
            content_name: "Megapack Productividad Total",
            seconds_on_page: checkpoint,
            active_time_seconds: Math.round(activeTime / 1000),
            attention_ratio:
                Math.round((activeTime / 1000 / checkpoint) * 100) + "%",
            scroll_reached: getScrollPercent(),
            });

            if (checkpoint === 180) clearInterval(timeInterval);
        }
        });
    }, 5000);

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
        isPageVisible = false;
        activeTime += Date.now() - lastActiveTimestamp;

        window.__MM_track("PageVisibility", {
            content_name: "Megapack Productividad Total",
            action: "hidden",
            active_time_seconds: Math.round(activeTime / 1000),
            total_time_seconds: Math.floor((Date.now() - startTime) / 1000),
            scroll_at_hide: getScrollPercent(),
        });
        } else {
        isPageVisible = true;
        lastActiveTimestamp = Date.now();

        window.__MM_track("PageVisibility", {
            content_name: "Megapack Productividad Total",
            action: "visible", 
            total_time_seconds: Math.floor((Date.now() - startTime) / 1000),
        });
        }
    });

    setInterval(function () {
        if (isPageVisible) {
        activeTime += Date.now() - lastActiveTimestamp;
        lastActiveTimestamp = Date.now();
        }
    }, 1000);

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (isIdle) {
        isIdle = false;
        }
        idleTimer = setTimeout(function () {
        if (!fired.idleDetected) {
            fired.idleDetected = true;
            isIdle = true;

            window.__MM_track("IdleDetection", {
            content_name: "Megapack Productividad Total",
            idle_at_seconds: Math.floor((Date.now() - startTime) / 1000),
            idle_at_scroll: getScrollPercent(),
            });
        }
        }, 30000); 
    }

    ["mousemove", "scroll", "keydown", "click", "touchstart"].forEach(
        function (event) {
        window.addEventListener(event, resetIdleTimer, { passive: true });
        },
    );

    resetIdleTimer(); 

    const sectionEvents = {
        problema: "ViewProblema", 
        modulos: "ViewModulos", 
        bonus: "ViewBonus", 
        "antes-despues": "ViewComparativa", 
        "es-para-ti": "ViewParaQuien", 
        "dos-caminos": "ViewDosCaminos", 
        "prueba-social": "ViewPruebaSocial", 
        oferta: "ViewOferta", 
        garantia: "ViewGarantia", 
        proceso: "ViewProceso", 
        faq: "ViewFAQ", 
    };

    const sectionObserver = new IntersectionObserver(
        function (entries) {
        entries.forEach(function (entry) {
            const id = entry.target.id;

            if (entry.isIntersecting && !fired.sections[id] && sectionEvents[id]) {
            fired.sections[id] = true;

            const timeToReach = Math.floor((Date.now() - startTime) / 1000);

            if (id === "oferta") {
                ofertaSeenTime = Date.now();

                window.__MM_track("ViewOferta", {
                content_name: "Megapack Productividad Total",
                section: id,
                time_to_reach_seconds: timeToReach,
                reading_pattern:
                    timeToReach < 60
                    ? "direct_to_price"
                    : timeToReach < 120
                        ? "normal_reader"
                        : "thorough_reader",
                currency: "USD",
                value: 4.9,
                });
            } else {
                window.__MM_track(sectionEvents[id], {
                content_name: "Megapack Productividad Total",
                section: id,
                time_to_reach_seconds: timeToReach,
                });
            }
            }
        });
        },
        { threshold: 0.3 },
    );

    Object.keys(sectionEvents).forEach(function (id) {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    document.addEventListener("DOMContentLoaded", function () {
    const buyButtons = document.querySelectorAll(
        'a[href*="pay.hotmart.com"], .btn--gold',
    );

    buyButtons.forEach(function (btn) {
        btn.addEventListener("mouseenter", function () {
        ctaHoverCount++;

        if (ctaHoverCount === 1) {
            window.__MM_track("HoverCTA", {
            content_name: "Megapack Productividad Total",
            hover_count: 1,
            time_on_page_seconds: Math.floor((Date.now() - startTime) / 1000),
            scroll_position: getScrollPercent(),
            saw_price_first: ofertaSeenTime !== null,
            });
        }

        if (ctaHoverCount === 3) {
            window.__MM_track("MultipleHoverCTA", {
            content_name: "Megapack Productividad Total",
            hover_count: ctaHoverCount,
            label: "alta_intencion",
            time_on_page_seconds: Math.floor((Date.now() - startTime) / 1000),
            });
        }
        });

        btn.addEventListener("click", function () {
        const timeToCheckout = Math.floor((Date.now() - startTime) / 1000);

        window.__MM_track("InitiateCheckout", {
            content_name: "Megapack Productividad Total",
            content_ids: ["megapack-productividad"],
            content_type: "product",
            currency: "USD",
            value: 4.9,
            num_items: 1,
            hover_count_before_click: ctaHoverCount,
            time_to_decision_seconds: timeToCheckout,
            scroll_at_click: getScrollPercent(),
            decision_speed:
            timeToCheckout < 60
                ? "impulse"
                : timeToCheckout < 180
                ? "considered"
                : "analytical",
            needed_multiple_hovers: ctaHoverCount >= 3,
        });
        });
    });
    });

    const faqButtons = document.querySelectorAll(".faq__question");

    faqButtons.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
        // Extraemos el texto de la pregunta (primeros 60 caracteres)
        const questionText = btn.querySelector("span")
            ? btn.querySelector("span").textContent.trim().substring(0, 60)
            : "pregunta_" + (index + 1);

        window.__MM_track("FAQInteraction", {
            content_name: "Megapack Productividad Total",
            question_index: index + 1,
            question_text: questionText,
            time_on_page_seconds: Math.floor((Date.now() - startTime) / 1000),
            scroll_position: getScrollPercent(),
        });
        });
    });

    document.addEventListener("selectionchange", function () {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 20 && !fired.textSelection) {
        fired.textSelection = true;

        window.__MM_track("TextSelection", {
            content_name: "Megapack Productividad Total",
            selected_length: selection.toString().length,
            time_on_page_seconds: Math.floor((Date.now() - startTime) / 1000),
            scroll_position: getScrollPercent(),
            selection_type:
            selection.toString().length < 50
                ? "phrase"
                : selection.toString().length < 200
                ? "paragraph"
                : "extensive",
        });
        }
    });

    document.addEventListener("copy", function () {
        if (!fired.copyAction) {
        fired.copyAction = true;

        window.__MM_track("CopyAction", {
            content_name: "Megapack Productividad Total",
            time_on_page_seconds: Math.floor((Date.now() - startTime) / 1000),
            scroll_position: getScrollPercent(),
            label: "investigating_or_sharing",
        });
        }
    });

    function checkHighEngagement() {
        const scrollOk = fired.scrollMilestones[75];
        const timeOk = fired.timeCheckpoints[60];
        const priceOk = fired.sections["oferta"];

        if (scrollOk && timeOk && priceOk && !fired.highEngagement) {
        fired.highEngagement = true;

        window.__MM_track("HighEngagement", {
            content_name: "Megapack Productividad Total",
            label: "lead_caliente",
            score:
            (fired.scrollMilestones[90] ? 1 : 0) + 
            (fired.timeCheckpoints[120] ? 1 : 0) + 
            (ctaHoverCount > 0 ? 1 : 0) + 
            (fired.sections["garantia"] ? 1 : 0) + 
            (fired.sections["faq"] ? 1 : 0) + 
            3, 
            saw_guarantee: fired.sections["garantia"] || false,
            hover_cta_count: ctaHoverCount,
            active_time_seconds: Math.round(activeTime / 1000),
            currency: "USD",
            value: 4.9,
        });
        }
    }

    setInterval(checkHighEngagement, 5000);

    document.addEventListener("mouseleave", function (e) {
        if (!fired.exitIntent && e.clientY <= 0) {
        fired.exitIntent = true;

        window.__MM_track("ExitIntent", {
            content_name: "Megapack Productividad Total",
            seconds_on_page: Math.floor((Date.now() - startTime) / 1000),
            active_time_seconds: Math.round(activeTime / 1000),
            scroll_reached: getScrollPercent(),
            saw_price: fired.sections["oferta"] || false,
            saw_guarantee: fired.sections["garantia"] || false,
            hover_count: ctaHoverCount,
            exit_temperature:
            ctaHoverCount > 0
                ? "hot"
                : fired.sections["oferta"]
                ? "warm"
                : "cold",
        });
        }
    });

    if (window.MM_CONFIG && window.MM_CONFIG.debug) {
        console.log(
        "%c[MM Tracking] ✅ Sistema de tracking ultra avanzado iniciado",
        "color: #00ff88; font-weight: bold;",
        );
        console.log("[MM Tracking] Eventos activos: 27");
        console.log("[MM Tracking] Pixel ID: 1513589057113085");
        console.log(
        "[MM Tracking] Worker:",
        "https://meta-capi-megapack.mentesmaestrasdigital.workers.dev",
        );
    }
    })();
