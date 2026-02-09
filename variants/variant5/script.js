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
    
    // Обработка изменения ориентации на мобильных
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            if (document.body.classList.contains("progress-open")) {
                closeProgressMenu();
            }
        }, 100);
    });
    
    // Улучшенная поддержка touch событий
    let touchStartY = 0;
    let touchStartTime = 0;
    
    links.forEach(link => {
        link.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            link.style.transform = "scale(0.98)";
        }, { passive: true });
        
        link.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            link.style.transform = "";
            
            // Предотвращаем случайные клики при прокрутке
            if (touchDistance > 10 || touchDuration > 500) {
                e.preventDefault();
                return;
            }
        });
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

    // Debounced scroll для лучшей производительности
    let scrollTimeout;
    rail.addEventListener("scroll", () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            rail.dataset.scrolled = rail.scrollLeft > 16 ? "true" : "false";
        }, 10);
    }, { passive: true });
    
    // Touch поддержка для горизонтальной прокрутки
    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    
    rail.addEventListener("touchstart", (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - rail.offsetLeft;
        scrollLeft = rail.scrollLeft;
    });
    
    rail.addEventListener("touchmove", (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - rail.offsetLeft;
        const walk = (x - startX) * 2;
        rail.scrollLeft = scrollLeft - walk;
    });
    
    rail.addEventListener("touchend", () => {
        isScrolling = false;
    });
}

function initHeaderEffects() {
    const header = document.querySelector(".header");
    if (!header) return;

    // Throttled scroll для производительности
    let ticking = false;
    
    function updateHeader() {
        const scrolled = window.scrollY > 40;
        header.classList.toggle("elevated", scrolled);
        ticking = false;
    }
    
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

function initApp() {
    initProgressNavigation();
    initContactForm();
    initRailParallax();
    initHeaderEffects();
    initMobileOptimizations();
}

function initMobileOptimizations() {
    // Предотвращение 300ms задержки на мобильных
    if ('ontouchstart' in window) {
        document.documentElement.style.touchAction = 'manipulation';
    }
    
    // Оптимизация viewport для мобильных Safari
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 
                'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
            );
        }
    }
    
    // Обработка swipe жестов для навигации
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaY) / deltaTime;
        
        // Swipe down для открытия меню (только на мобильных)
        if (window.innerWidth <= 1200 && deltaY < -100 && velocity > 0.3 && window.scrollY < 50) {
            const progressAside = document.querySelector('.progress-aside');
            const body = document.body;
            
            if (!body.classList.contains('progress-open')) {
                body.classList.add('progress-open');
                const toggleBtn = document.querySelector('.progress-toggle');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-expanded', 'true');
                }
            }
        }
    }, { passive: true });
    
    // Улучшение smooth scroll для iOS
    if (CSS.supports('scroll-behavior', 'smooth')) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Автоматическое закрытие меню при клике на ссылки
    document.addEventListener('click', (e) => {
        if (e.target.matches('.progress-link') && window.innerWidth <= 1200) {
            setTimeout(() => {
                document.body.classList.remove('progress-open');
                const toggleBtn = document.querySelector('.progress-toggle');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            }, 300);
        }
    });
}

window.addEventListener("DOMContentLoaded", initApp);

