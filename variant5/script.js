function initProgressNavigation() {
    const links = document.querySelectorAll(".progress-link");
    const sections = document.querySelectorAll("section[data-progress]");
    const toggleBtn = document.querySelector(".progress-toggle");
    const overlay = document.querySelector(".progress-overlay");

    function setActive(targetId) {
        links.forEach(link => {
            const sectionName = link.dataset.section;
            if (sectionName === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.dataset.progress);
            }
        });
    }, {
        threshold: 0.45,
        rootMargin: "0px 0px -20% 0px"
    });

    sections.forEach(section => observer.observe(section));

    if (sections[0]) {
        setActive(sections[0].dataset.progress);
    }

    function closeProgressMenu() {
        document.body.classList.remove("progress-open");
        if (toggleBtn) {
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    }

    function toggleProgressMenu() {
        if (!toggleBtn) return;
        const isOpen = document.body.classList.toggle("progress-open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
    }

    links.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 1200) {
                closeProgressMenu();
            }
        });
    });

    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleProgressMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", closeProgressMenu);
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1200 && document.body.classList.contains("progress-open")) {
            closeProgressMenu();
        }
    });
}

function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const button = form.querySelector("button");
        button.disabled = true;
        button.textContent = "Wird gesendet...";
        setTimeout(() => {
            button.disabled = false;
            button.textContent = "R5ckruf einplanen";
            form.reset();
            alert("Vielen Dank! Wir melden uns innerhalb eines Werktages.");
        }, 1200);
    });
}

function initRailParallax() {
    const rail = document.querySelector(".operations-rail");
    if (!rail) return;

    rail.addEventListener("scroll", () => {
        rail.dataset.scrolled = rail.scrollLeft > 16 ? "true" : "false";
    });
}

function initHeaderEffects() {
    const header = document.querySelector(".header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY > 40;
        header.classList.toggle("elevated", scrolled);
    });
}

function initApp() {
    initProgressNavigation();
    initContactForm();
    initRailParallax();
    initHeaderEffects();
}

window.addEventListener("DOMContentLoaded", initApp);

