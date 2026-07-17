    (function () {
    // tracking ligero — Megapack Productividad Total (funnel hacking / pauta)
    "use strict";

    if (typeof window.__MM_track !== "function") {
        console.warn("[MM Tracking] Pixel core no encontrado. Abortando.");
        return;
    }

    // ── ViewContent — se dispara al cargar la página ──
    window.__MM_track("ViewContent", {
        content_name: "Megapack Productividad Total",
        content_category: "Plantillas Digitales",
        content_ids: ["megapack-productividad"],
        content_type: "product",
        currency: "USD",
        value: 4.9,
    });

    // ── InitiateCheckout — se dispara al hacer clic en el botón de compra ──
    document.addEventListener("DOMContentLoaded", function () {
        const buyButtons = document.querySelectorAll(
        'a[href*="pay.hotmart.com"], .btn--gold',
        );

        buyButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            window.__MM_track("InitiateCheckout", {
            content_name: "Megapack Productividad Total",
            content_ids: ["megapack-productividad"],
            content_type: "product",
            currency: "USD",
            value: 4.9,
            num_items: 1,
            });
        });
        });
    });

    if (window.MM_CONFIG && window.MM_CONFIG.debug) {
        console.log(
        "%c[MM Tracking] ✅ Tracking ligero Megapack iniciado",
        "color: #00ff88; font-weight: bold;",
        );
        console.log("[MM Tracking] Eventos activos: ViewContent, InitiateCheckout");
        console.log("[MM Tracking] Pixel ID: 1067595579179473");
        console.log(
        "[MM Tracking] Worker:",
        "https://megapack-capi-worker.mentesmaestrasdigital.workers.dev",
        );
    }
    })();
