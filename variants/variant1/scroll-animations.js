/**
 * Universal Scroll Animations System
 * Универсальная система анимаций при скролле
 * Совместима со всеми вариантами сайта
 */

class ScrollAnimations {
    constructor(options = {}) {
        this.options = {
            // Настройки Intersection Observer
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            
            // Селекторы для анимации
            selectors: options.selectors || [
                '.fade-in-up',
                '.fade-in-down', 
                '.fade-in-left',
                '.fade-in-right',
                '.slide-in-left',
                '.slide-in-right',
                '.scale-in',
                '.animate-on-scroll',
                '.service-card',
                '.about-text',
                '.philosophy-text',
                '.benefits-preview',
                '.feature-item',
                '.office-service',
                '.step',
                '.contact-item'
            ],
            
            // CSS классы
            animatedClass: 'animated-in',
            visibleClass: 'is-visible',
            
            // Дебаг режим
            debug: options.debug || false,
            
            ...options
        };
        
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }
    
    init() {
        this.log('Инициализация системы анимаций');
        this.addStyles();
        this.setupObserver();
        this.observeElements();
        this.log(`Наблюдение за ${this.animatedElements.size} элементами`);
    }
    
    log(message, ...args) {
        if (this.options.debug) {
            console.log('[ScrollAnimations]', message, ...args);
        }
    }
    
    addStyles() {
        // Проверяем, не добавлены ли уже стили
        if (document.getElementById('scroll-animations-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'scroll-animations-styles';
        style.textContent = `
            /* Базовые стили для анимаций */
            .fade-in-up,
            .fade-in-down,
            .fade-in-left,
            .fade-in-right,
            .slide-in-left,
            .slide-in-right,
            .scale-in,
            .animate-on-scroll {
                opacity: 0;
                transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                will-change: opacity, transform;
            }
            
            /* Начальные состояния */
            .fade-in-up { transform: translateY(30px); }
            .fade-in-down { transform: translateY(-30px); }
            .fade-in-left { transform: translateX(-30px); }
            .fade-in-right { transform: translateX(30px); }
            .slide-in-left { transform: translateX(-60px); }
            .slide-in-right { transform: translateX(60px); }
            .scale-in { transform: scale(0.8); }
            
            /* Анимированные состояния */
            .fade-in-up.animated-in,
            .fade-in-down.animated-in,
            .fade-in-left.animated-in,
            .fade-in-right.animated-in,
            .slide-in-left.animated-in,
            .slide-in-right.animated-in,
            .scale-in.animated-in,
            .animate-on-scroll.animated-in {
                opacity: 1;
                transform: translateY(0) translateX(0) scale(1);
            }
            
            /* Специальные элементы */
            .service-card,
            .office-service,
            .step,
            .contact-item,
            .about-text,
            .philosophy-text,
            .benefits-preview,
            .feature-item {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease-out;
            }
            
            .service-card.animated-in,
            .office-service.animated-in,
            .step.animated-in,
            .contact-item.animated-in,
            .about-text.animated-in,
            .philosophy-text.animated-in,
            .benefits-preview.animated-in,
            .feature-item.animated-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Эффекты задержки */
            .animated-in {
                animation-fill-mode: forwards;
            }
            
            /* Более плавные анимации для мобильных устройств */
            @media (prefers-reduced-motion: reduce) {
                .fade-in-up,
                .fade-in-down,
                .fade-in-left,
                .fade-in-right,
                .slide-in-left,
                .slide-in-right,
                .scale-in,
                .animate-on-scroll,
                .service-card,
                .office-service,
                .step,
                .contact-item,
                .about-text,
                .philosophy-text,
                .benefits-preview,
                .feature-item {
                    transition: opacity 0.3s ease;
                    transform: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        this.log('CSS стили добавлены');
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );
        
        this.log('Intersection Observer создан');
    }
    
    observeElements() {
        // Собираем все элементы для наблюдения
        this.options.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Избегаем дублирования
                if (!this.animatedElements.has(element)) {
                    this.observer.observe(element);
                    this.animatedElements.add(element);
                    
                    // Добавляем data-атрибут для отслеживания
                    element.setAttribute('data-scroll-animation', 'pending');
                    
                    this.log(`Наблюдение за элементом: ${selector}`, element);
                }
            });
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
            }
        });
    }
    
    animateElement(element) {
        // Проверяем, не анимирован ли уже элемент
        if (element.getAttribute('data-scroll-animation') === 'completed') {
            return;
        }
        
        // Получаем задержку из data-delay атрибута
        const delay = parseInt(element.dataset.delay) || 0;
        
        this.log(`Анимация элемента с задержкой ${delay}ms`, element);
        
        setTimeout(() => {
            // Добавляем класс анимации
            element.classList.add(this.options.animatedClass);
            element.classList.add(this.options.visibleClass);
            
            // Отмечаем как завершенный
            element.setAttribute('data-scroll-animation', 'completed');
            
            // Анимируем дочерние элементы
            this.animateChildren(element);
            
            // Прекращаем наблюдение за этим элементом
            this.observer.unobserve(element);
            
        }, delay);
    }
    
    animateChildren(parent) {
        // Ищем дочерние элементы с классами анимации
        const children = parent.querySelectorAll(this.options.selectors.join(','));
        
        children.forEach((child, index) => {
            if (child.getAttribute('data-scroll-animation') !== 'completed') {
                const childDelay = parseInt(child.dataset.delay) || (index * 100);
                
                setTimeout(() => {
                    child.classList.add(this.options.animatedClass);
                    child.classList.add(this.options.visibleClass);
                    child.setAttribute('data-scroll-animation', 'completed');
                }, childDelay);
            }
        });
    }
    
    // Публичные методы
    refresh() {
        this.log('Обновление списка элементов');
        this.observeElements();
    }
    
    destroy() {
        this.log('Уничтожение наблюдателя');
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Удаляем стили
        const styleElement = document.getElementById('scroll-animations-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }
    
    // Принудительная анимация элемента
    forceAnimate(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            this.animateElement(element);
        }
    }
    
    // Получение статистики
    getStats() {
        const pending = document.querySelectorAll('[data-scroll-animation="pending"]').length;
        const completed = document.querySelectorAll('[data-scroll-animation="completed"]').length;
        
        return {
            total: this.animatedElements.size,
            pending,
            completed,
            animated: completed
        };
    }
}

// Автоматическая инициализация при загрузке DOM
let scrollAnimations;

function initScrollAnimations() {
    // Проверяем, не инициализирован ли уже
    if (scrollAnimations) {
        scrollAnimations.destroy();
    }
    
    // Создаем новый экземпляр
    scrollAnimations = new ScrollAnimations({
        debug: false // Включите для дебага: true
    });
    
    // Делаем доступным глобально для отладки
    window.scrollAnimations = scrollAnimations;
    
    console.log('Система анимаций инициализирована');
}

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollAnimations;
}

// Обновление при изменении содержимого (для SPA)
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Проверяем, добавились ли элементы с классами анимации
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const hasAnimationClasses = scrollAnimations?.options.selectors.some(selector => 
                            node.matches && node.matches(selector)
                        );
                        
                        if (hasAnimationClasses) {
                            shouldRefresh = true;
                        }
                    }
                });
            }
        });
        
        if (shouldRefresh && scrollAnimations) {
            setTimeout(() => scrollAnimations.refresh(), 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}