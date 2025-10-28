// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    updateParallax(); // Initial call
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    let headerTicking = false;
    window.addEventListener('scroll', () => {
        if (!headerTicking) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                headerTicking = false;
            });
            headerTicking = true;
        }
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .office-service, .step, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                // Show success message
                showNotification('Сообщение успешно отправлено!', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : '#2196F3',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Lazy Loading for Images (when real images are added)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// CTA Button Scroll Effect
function initCTAScroll() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Add CSS for mobile menu and animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Menu Styles */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                z-index: 1000;
            }
            
            .nav-menu.active {
                transform: translateY(0);
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
        }
        
        /* Scroll Animations */
        .service-card,
        .office-service,
        .step,
        .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .service-card.animate-in,
        .office-service.animate-in,
        .step.animate-in,
        .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Header Scroll Effect */
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Loading Animation for Submit Button */
        .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Enhanced Parallax Background Gradients */
        .hero .parallax-bg {
            background: linear-gradient(135deg, 
                rgba(245, 247, 250, 0.9) 0%, 
                rgba(195, 207, 226, 0.9) 50%, 
                rgba(169, 169, 169, 0.1) 100%);
        }
        
        .about-image .parallax-bg {
            background: linear-gradient(45deg, 
                #f8f9fa 0%, 
                #e9ecef 50%, 
                #dee2e6 100%);
        }
        
        .service-icon .parallax-bg {
            background: linear-gradient(135deg, 
                var(--accent-color) 0%, 
                #1e4a8c  100%);
        }
        
        .expansion-image .parallax-bg {
            background: linear-gradient(120deg, 
                #f1f3f4 0%, 
                #e8eaf6 50%, 
                #c5cae9 100%);
        }
        
        .service-image .parallax-bg {
            background: linear-gradient(60deg, 
                #fafafa 0%, 
                #f5f5f5 50%, 
                #eeeeee 100%);
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize all features
    initParallax();
    initSmoothScrolling();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initFormHandling();
    initLazyLoading();
    initCTAScroll();
});

// Handle window resize for parallax
window.addEventListener('resize', () => {
    // Reinitialize parallax on resize
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(element => {
        element.style.transform = 'translateY(0px)';
    });
});

// Performance optimization: pause parallax when tab is not visible
document.addEventListener('visibilitychange', () => {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    if (document.hidden) {
        // Pause animations when tab is not visible
        parallaxElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab becomes visible
        parallaxElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});