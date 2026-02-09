function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const navToggle = document.querySelector(".nav-toggle");
    const navList = document.querySelector(".primary-nav ul");

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");
            smoothScrollTo(href);
            navList.classList.remove("open");
        });
    });

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navList.classList.toggle("open");
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = `#${entry.target.id}`;
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === id);
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: "0px 0px -20% 0px"
    });

    sections.forEach(section => observer.observe(section));
}

function initAccordions() {
    const toggles = document.querySelectorAll('[data-accordion]');
    toggles.forEach(button => {
        const panel = button.nextElementSibling;
        button.setAttribute('aria-expanded', 'false');
        if (panel) {
            panel.style.maxHeight = '0px';
        }

        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            toggles.forEach(otherBtn => {
                const otherPanel = otherBtn.nextElementSibling;
                otherBtn.setAttribute('aria-expanded', 'false');
                if (otherPanel) {
                    otherPanel.style.maxHeight = '0px';
                    otherPanel.classList.remove('open');
                }
            });

            if (!expanded && panel) {
                button.setAttribute('aria-expanded', 'true');
                panel.classList.add('open');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    if (toggles[0]) {
        toggles[0].click();
    }
}

function initSlider() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;

    const slidesContainer = slider.querySelector('.slides');
    const cards = slider.querySelectorAll('.testimonial-card');
    const dotsContainer = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('[data-prev]');
    const nextBtn = slider.querySelector('[data-next]');
    let index = 0;
    let autoTimer = null;

    function renderDots() {
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('type', 'button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function goToSlide(target) {
        index = (target + cards.length) % cards.length;
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
        restartAuto();
    }

    function restartAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
        }
        autoTimer = setInterval(() => goToSlide(index + 1), 6000);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(index - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(index + 1));
    }

    renderDots();
    goToSlide(0);
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = form.querySelector('button');
        button.disabled = true;
        button.textContent = 'Wird gesendet...';
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Moodboard erhalten';
            form.reset();
            alert('Vielen Dank! Wir melden uns mit einem kuratierten Moodboard.');
        }, 1400);
    });
}

function initPage() {
    initNavigation();
    initAccordions();
    initSlider();
    initContactForm();
}

window.addEventListener('DOMContentLoaded', initPage);
