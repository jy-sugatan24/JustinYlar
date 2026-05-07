(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scrolling for same-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        var id = anchor.getAttribute("href");
        if (id === "#") return;

        anchor.addEventListener("click", function (e) {
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });

            closeMobileNav();

            document.querySelectorAll(".site-nav a.is-active").forEach(function (a) {
                a.classList.remove("is-active");
            });
            if (anchor.hasAttribute("data-nav")) anchor.classList.add("is-active");
        });
    });

    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".nav-toggle");
    var siteNav = document.querySelector(".site-nav");

    function closeMobileNav() {
        if (!navToggle || !siteNav) return;
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
    }

    function openMobileNav() {
        siteNav.classList.add("is-open");
        navToggle.setAttribute("aria-expanded", "true");
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            var expanded = navToggle.getAttribute("aria-expanded") === "true";
            if (expanded) closeMobileNav();
            else openMobileNav();
        });

        document.addEventListener("click", function (e) {
            if (!siteNav.contains(e.target) && !navToggle.contains(e.target))
                closeMobileNav();
        });

        window.addEventListener("resize", function () {
            if (window.matchMedia("(min-width: 769px)").matches) closeMobileNav();
        });
    }

    window.addEventListener("scroll", function () {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    }, { passive: true });

    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".site-nav a[data-nav]");

    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.getAttribute("id");
                    navLinks.forEach(function (link) {
                        link.classList.toggle("is-active", link.getAttribute("data-nav") === id);
                    });
                });
            },
            {
                root: null,
                rootMargin: "-40% 0px -52% 0px",
                threshold: 0
            }
        );
        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    navLinks.forEach(function (link) {
        var id = link.getAttribute("href");
        if (id === "#home" && window.location.hash === "") link.classList.add("is-active");
    });
})();
