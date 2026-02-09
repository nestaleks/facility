class SlideShow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.progressBar = document.querySelector('.progress-bar');
        this.loader = document.querySelector('.loader');
        this.isScrolling = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.scrollTimeout = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        console.log(`Initializing with ${this.slides.length} slides, current slide: ${this.currentSlide}`);
        this.hideLoader();
        this.setupEventListeners();
        this.updateProgressBar();
        this.updateSlideBackgrounds();
        this.updateNavigation();
        this.updateNavigationButtons();
        
        // Убеждаемся что первый слайд активен
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    hideLoader() {
        setTimeout(() => {
            this.loader.classList.add('hidden');
        }, 1500);
    }
    
    setupEventListeners() {
        // Скролл для десктопа
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Touch события для мобильных
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Навигация точками
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide) || index;
                console.log(`Clicking dot ${index}, going to slide ${slideIndex}`);
                this.goToSlide(slideIndex);
            });
        });
        
        // Стрелки навигации
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.prevSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextSlide();
            });
        }
        
        // Клавиатура
        window.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Resize для адаптивности
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Обработка кнопок и форм
        this.setupInteractiveElements();
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        if (this.isAnimating) return;
        
        const delta = e.deltaY;
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            if (delta > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }, 50);
    }
    
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        
        if (this.isAnimating) return;
        
        this.touchEndY = e.changedTouches[0].clientY;
        const deltaY = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleKeyboard(e) {
        if (this.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        if (index === this.currentSlide || this.isAnimating || index < 0 || index >= this.slides.length) return;
        
        console.log(`Going to slide ${index}, current slide: ${this.currentSlide}`);
        
        this.isAnimating = true;
        const previousSlide = this.currentSlide;
        
        // СНАЧАЛА обновляем currentSlide
        this.currentSlide = index;
        
        // Убираем активный класс со всех слайдов
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        // Устанавливаем направления анимации
        if (index > previousSlide) {
            // Движение вниз
            this.slides[previousSlide].classList.add('prev');
            this.slides[index].classList.add('next');
        } else {
            // Движение вверх
            this.slides[previousSlide].classList.add('next');
            this.slides[index].classList.add('prev');
        }
        
        // Обновляем UI сразу
        this.updateNavigation();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Обновляем фон текущего слайда
        this.updateSlideBackground(index);
        
        // Запускаем анимацию
        setTimeout(() => {
            this.slides[index].classList.remove('prev', 'next');
            this.slides[index].classList.add('active');
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }, 50);
    }
    
    updateSlideBackground(index) {
        const slide = this.slides[index];
        const bgGradient = slide.dataset.bg;
        if (bgGradient) {
            slide.style.background = bgGradient;
        }
    }
    
    updateSlideBackgrounds() {
        this.slides.forEach((slide, index) => {
            const bgGradient = slide.dataset.bg;
            if (bgGradient) {
                slide.style.background = bgGradient;
            }
        });
    }
    
    updateNavigation() {
        console.log(`Updating navigation, current slide: ${this.currentSlide}`);
        this.navDots.forEach((dot, index) => {
            const slideIndex = parseInt(dot.dataset.slide) || index;
            const isActive = slideIndex === this.currentSlide;
            dot.classList.toggle('active', isActive);
            console.log(`Dot ${index} (slide ${slideIndex}): ${isActive ? 'active' : 'inactive'}`);
        });
    }
    
    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');
        
        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    }
    
    // Удалена функция preloadNextSlides - больше не нужна
    
    handleResize() {
        // Обновление при изменении размера окна
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateProgressBar();
        }, 250);
    }
    
    setupInteractiveElements() {
        // Обработка кнопки CTA
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.goToSlide(4); // Переход к форме контактов
            });
        }
        
        // Обработка формы
        const submitButton = document.querySelector('.submit-button');
        const formInputs = document.querySelectorAll('.form-input');
        
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmit(formInputs);
            });
        }
        
        // Обработка клика по карточкам квартир
        const apartmentCards = document.querySelectorAll('.apartment-card');
        apartmentCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleApartmentSelect(card);
            });
        });
        
        // Анимация появления элементов при переходе к слайду
        this.setupSlideAnimations();
    }
    
    handleFormSubmit(inputs) {
        const formData = {};
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            if (!value) {
                isValid = false;
                input.style.borderColor = 'rgba(255, 100, 100, 0.8)';
                setTimeout(() => {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }, 2000);
            } else {
                formData[input.placeholder] = value;
            }
        });
        
        if (isValid) {
            this.showSuccessMessage();
            inputs.forEach(input => input.value = '');
        }
    }
    
    showSuccessMessage() {
        const button = document.querySelector('.submit-button');
        const originalText = button.textContent;
        
        button.textContent = 'Заявка отправлена!';
        button.style.background = 'rgba(100, 255, 100, 0.3)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'rgba(255, 255, 255, 0.2)';
        }, 3000);
    }
    
    handleApartmentSelect(card) {
        // Удаляем выделение с других карточек
        document.querySelectorAll('.apartment-card').forEach(c => {
            c.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        });
        
        // Выделяем выбранную карточку
        card.style.border = '2px solid rgba(255, 255, 255, 0.8)';
        
        // Добавляем анимацию выбора
        card.style.transform = 'translateY(-15px) scale(1.05)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }, 200);
    }
    
    setupSlideAnimations() {
        // Создаем наблюдатель для анимации элементов при смене слайдов
        const animateElements = (slide) => {
            const elements = slide.querySelectorAll('.slide-title, .slide-subtitle, .slide-text, .feature-item, .apartment-card, .infra-item, .contact-item');
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100 + 300);
            });
        };
        
        // Анимируем элементы при смене слайдов
        const originalGoToSlide = this.goToSlide.bind(this);
        this.goToSlide = function(index) {
            originalGoToSlide(index);
            setTimeout(() => {
                animateElements(this.slides[index]);
            }, 400);
        };
    }
}

// Утилиты для работы с device orientation (мобильные)
class MobileOptimizer {
    constructor(slideShow) {
        this.slideShow = slideShow;
        this.init();
    }
    
    init() {
        this.detectMobile();
        this.optimizeForMobile();
        this.handleOrientationChange();
    }
    
    detectMobile() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTouch = 'ontouchstart' in window;
    }
    
    optimizeForMobile() {
        if (this.isMobile || this.isTouch) {
            // Отключаем hover эффекты на мобильных
            document.body.classList.add('mobile-device');
            
            // Добавляем стили для мобильных
            const mobileStyles = document.createElement('style');
            mobileStyles.textContent = `
                .mobile-device .feature-item:hover,
                .mobile-device .apartment-card:hover,
                .mobile-device .infra-item:hover {
                    transform: none;
                }
                
                .mobile-device .nav-arrow {
                    width: 60px;
                    height: 60px;
                    font-size: 28px;
                }
                
                .mobile-device .navigation {
                    bottom: 30px;
                }
            `;
            document.head.appendChild(mobileStyles);
        }
    }
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.slideShow.handleResize();
            }, 100);
        });
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const slideShow = new SlideShow();
    const mobileOptimizer = new MobileOptimizer(slideShow);
    
    // Добавляем поддержку жестов для мобильных
    if ('serviceWorker' in navigator) {
        // Кэширование для офлайн работы (опционально)
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Игнорируем ошибки service worker
        });
    }
});

// Дополнительные утилиты
const Utils = {
    debounce: function(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    throttle: function(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }
};