/**
 * Main JavaScript functionality for Decktum Deutschland website
 * Modern ES6+ vanilla JavaScript with progressive enhancement
 */

'use strict';

class DecktumWebsite {
  constructor() {
    this.init();
  }

  /**
   * Initialize all functionality
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupComponents();
      });
    } else {
      this.setupComponents();
    }
  }

  /**
   * Setup all components
   */
  setupComponents() {
    try {
      this.setupMobileMenu();
      this.setupVideoControls();
      this.setupSmoothScrolling();
      this.setupHeaderBehavior();
      this.setupScrollToTop();
      this.setupKeyboardNavigation();
      this.setupFormEnhancements();
      this.setupPerformanceMonitoring();
      
      console.log('Decktum Deutschland website initialized successfully');
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }

  /**
   * Mobile Menu functionality
   */
  setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-navigation');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    if (!menuToggle || !mobileMenu) return;

    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu(menuToggle, mobileMenu);
    });

    // Close menu when clicking on links
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu(menuToggle, mobileMenu);
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        this.closeMobileMenu(menuToggle, mobileMenu);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && 
          !mobileMenu.contains(e.target) && 
          !mobileMenu.hidden) {
        this.closeMobileMenu(menuToggle, mobileMenu);
      }
    });
  }

  /**
   * Toggle mobile menu state
   */
  toggleMobileMenu(toggle, menu) {
    const isOpen = !menu.hidden;
    
    if (isOpen) {
      this.closeMobileMenu(toggle, menu);
    } else {
      this.openMobileMenu(toggle, menu);
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu(toggle, menu) {
    menu.hidden = false;
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    
    // Trap focus within menu
    this.trapFocus(menu);
    
    // Prevent body scrolling
    document.body.classList.add('no-scroll');
    
    // Announce to screen readers
    this.announceToScreenReader('Menü geöffnet');
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(toggle, menu) {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    
    // Allow body scrolling
    document.body.classList.remove('no-scroll');
    
    // Remove focus trap
    this.removeFocusTrap();
    
    // Hide after animation
    setTimeout(() => {
      menu.hidden = true;
    }, 300);
    
    // Announce to screen readers
    this.announceToScreenReader('Menü geschlossen');
  }

  /**
   * Video controls functionality
   */
  setupVideoControls() {
    const videoControlBtn = document.querySelector('.video-control-btn');
    const desktopVideo = document.querySelector('#hero-video-desktop');
    const mobileVideo = document.querySelector('#hero-video-mobile');
    
    if (!videoControlBtn) return;

    // Get active video based on screen size
    const getActiveVideo = () => {
      return window.innerWidth >= 768 ? desktopVideo : mobileVideo;
    };

    // Handle video control clicks
    videoControlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeVideo = getActiveVideo();
      
      if (activeVideo) {
        this.toggleVideoPlayback(activeVideo, videoControlBtn);
      }
    });

    // Handle video events
    [desktopVideo, mobileVideo].forEach(video => {
      if (video) {
        video.addEventListener('play', () => {
          videoControlBtn.classList.add('playing');
          videoControlBtn.setAttribute('aria-label', 'Video pausieren');
        });

        video.addEventListener('pause', () => {
          videoControlBtn.classList.remove('playing');
          videoControlBtn.setAttribute('aria-label', 'Video abspielen');
        });

        // Auto-hide controls after video starts playing
        video.addEventListener('play', () => {
          setTimeout(() => {
            if (!video.paused) {
              videoControlBtn.style.opacity = '0';
            }
          }, 3000);
        });

        video.addEventListener('pause', () => {
          videoControlBtn.style.opacity = '0.8';
        });
      }
    });

    // Show controls on mouse movement
    let hideControlsTimeout;
    document.addEventListener('mousemove', () => {
      videoControlBtn.style.opacity = '0.8';
      clearTimeout(hideControlsTimeout);
      
      const activeVideo = getActiveVideo();
      if (activeVideo && !activeVideo.paused) {
        hideControlsTimeout = setTimeout(() => {
          videoControlBtn.style.opacity = '0';
        }, 3000);
      }
    });
  }

  /**
   * Toggle video playback
   */
  toggleVideoPlayback(video) {
    try {
      if (video.paused) {
        video.play();
        this.announceToScreenReader('Video wird abgespielt');
      } else {
        video.pause();
        this.announceToScreenReader('Video pausiert');
      }
    } catch (error) {
      console.error('Error controlling video playback:', error);
    }
  }

  /**
   * Smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    // Use CSS scroll-behavior: smooth as primary method
    document.documentElement.style.scrollBehavior = 'smooth';

    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target && href !== '#') {
          e.preventDefault();
          this.smoothScrollTo(target);
        }
      });
    });
  }

  /**
   * Smooth scroll to element
   */
  smoothScrollTo(element, offset = 100) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    // Use modern scrollTo with smooth behavior
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update focus for accessibility
    setTimeout(() => {
      element.focus({ preventScroll: true });
    }, 500);
  }

  /**
   * Header scroll behavior
   */
  setupHeaderBehavior() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class for styling
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    // Throttle scroll events using requestAnimationFrame
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Scroll to top functionality
   */
  setupScrollToTop() {
    // Create scroll to top button
    const scrollButton = this.createScrollToTopButton();
    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    let ticking = false;
    const updateButtonVisibility = () => {
      if (window.scrollY > 300) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateButtonVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Handle button click
    scrollButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Create scroll to top button
   */
  createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Nach oben scrollen');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    `;

    // Add styles
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '3rem',
      height: '3rem',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-background)',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-lg)',
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease',
      zIndex: 'var(--z-docked)'
    });

    return button;
  }

  /**
   * Enhanced keyboard navigation
   */
  setupKeyboardNavigation() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Enhanced focus visibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Arrow key navigation for menus
    this.setupArrowKeyNavigation();
  }

  /**
   * Arrow key navigation for menus
   */
  setupArrowKeyNavigation() {
    const navMenus = document.querySelectorAll('.nav-menu, .mobile-menu');
    
    navMenus.forEach(menu => {
      const links = menu.querySelectorAll('a');
      
      menu.addEventListener('keydown', (e) => {
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        
        switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % links.length;
          links[nextIndex].focus();
          break;
        }
            
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
          links[prevIndex].focus();
          break;
        }
        }
      });
    });
  }

  /**
   * Form enhancements
   */
  setupFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add form validation
      this.setupFormValidation(form);
      
      // Enhance form accessibility
      this.enhanceFormAccessibility(form);
    });
  }

  /**
   * Basic form validation
   */
  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      // Clear errors on input
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
      }
    });
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Dieses Feld ist erforderlich';
    }
    
    // Email validation
    else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    // Phone validation
    else if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /**
   * Email validation
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation (German format)
   */
  isValidPhone(phone) {
    const phoneRegex = /^(\+49|0)[1-9]\d{8,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorElement);
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.setAttribute('aria-invalid', 'false');
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Enhance form accessibility
   */
  enhanceFormAccessibility(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
      // Ensure proper labeling
      if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label) {
          field.setAttribute('aria-labelledby', label.id || `${field.id}-label`);
        }
      }
    });
  }

  /**
   * Focus trap for modal/menu elements
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', this.focusTrapHandler);
  }

  /**
   * Remove focus trap
   */
  removeFocusTrap() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('performance' in window) {
      // Log performance metrics
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          if (loadTime > 0) {
            console.log(`Page load time: ${loadTime}ms`);
          }
        }, 0);
      });

      // Monitor Long Tasks (if supported)
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.duration > 50) {
                console.warn(`Long task detected: ${entry.duration}ms`);
              }
            });
          });
          observer.observe({ entryTypes: ['longtask'] });
        } catch (error) {
          // Long tasks not supported in all browsers
        }
      }
    }
  }

  /**
   * Utility: Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Utility: Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize the website when DOM is ready
new DecktumWebsite();

// Add CSS for scroll-to-top button visibility
const style = document.createElement('style');
style.textContent = `
  .scroll-to-top.visible {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
  }
  
  .scroll-to-top:hover {
    background-color: var(--color-primary-dark) !important;
    transform: translateY(-2px) !important;
  }
  
  .field-error {
    color: var(--color-error);
    font-size: var(--font-size-sm);
    margin-top: var(--space-xs);
  }
  
  .error {
    border-color: var(--color-error) !important;
    background-color: rgba(220, 53, 69, 0.1) !important;
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--color-primary) !important;
    outline-offset: 2px !important;
  }
`;

document.head.appendChild(style);

// Export for potential use in other modules (Node.js environment)
if (typeof window === 'undefined' && typeof module !== 'undefined' && module.exports) {
  module.exports = DecktumWebsite;
}
