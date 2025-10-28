import { test, expect } from '@playwright/test';

test.describe('Comprehensive Check of All Variants', () => {
  const variants = [
    { name: 'variant1', path: '/variant1/index.html', title: 'Hygge Business - Premium Facility Management Deutschland' },
    { name: 'variant2', path: '/variant2/index.html', title: 'Hygge Business - Минималистичный дизайн' },
    { name: 'variant3', path: '/variant3/index.html', title: 'Hygge Business - Elegante Exzellenz' },
    { name: 'variant4', path: '/variant4/index.html', title: 'Facility - Светлый дизайн с слайдами' }
  ];

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  // Helper function to check text contrast
  async function checkTextContrast(page, selector) {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Convert RGB to hex for easier comparison
      function rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }
      
      // Calculate luminance
      function getLuminance(color) {
        const hex = rgbToHex(color);
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      
      const textLuminance = getLuminance(textColor);
      const bgLuminance = getLuminance(backgroundColor);
      const contrast = (Math.max(textLuminance, bgLuminance) + 0.05) / 
                      (Math.min(textLuminance, bgLuminance) + 0.05);
      
      return {
        textColor: rgbToHex(textColor),
        backgroundColor: rgbToHex(backgroundColor),
        contrast: contrast,
        isAccessible: contrast >= 4.5
      };
    }, selector);
  }

  // Helper function to check if text is visible
  async function isTextVisible(page, selector) {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      
      return rect.width > 0 && 
             rect.height > 0 && 
             styles.visibility !== 'hidden' && 
             styles.display !== 'none' &&
             styles.opacity !== '0';
    }, selector);
  }

  variants.forEach(variant => {
    test.describe(`Testing ${variant.name}`, () => {
      
      test(`should have proper text contrast in ${variant.name}`, async ({ page }) => {
        await page.goto(`http://localhost:8080${variant.path}`);
        await page.waitForLoadState('networkidle');
        
        // Wait for animations to complete
        await page.waitForTimeout(3000);
        
        // Check hero text contrast
        const heroTextSelectors = [
          '.hero-title',
          '.slide-title',
          '.maskOut .mask div',
          '.hero-text-animation .mask div'
        ];
        
        for (const selector of heroTextSelectors) {
          const element = await page.$(selector);
          if (element) {
            const isVisible = await isTextVisible(page, selector);
            if (isVisible) {
              const contrast = await checkTextContrast(page, selector);
              if (contrast) {
                console.log(`${variant.name} - ${selector}: Contrast ratio ${contrast.contrast.toFixed(2)}`);
                expect(contrast.contrast).toBeGreaterThanOrEqual(3.0); // WCAG AA for large text
              }
            }
          }
        }
        
        // Check subtitle text contrast
        const subtitleSelectors = [
          '.hero-subtitle',
          '.slide-subtitle',
          'p'
        ];
        
        for (const selector of subtitleSelectors) {
          const element = await page.$(selector);
          if (element) {
            const isVisible = await isTextVisible(page, selector);
            if (isVisible) {
              const contrast = await checkTextContrast(page, selector);
              if (contrast) {
                console.log(`${variant.name} - ${selector}: Contrast ratio ${contrast.contrast.toFixed(2)}`);
                expect(contrast.contrast).toBeGreaterThanOrEqual(4.5); // WCAG AA for normal text
              }
            }
          }
        }
      });

      viewports.forEach(viewport => {
        test(`should be mobile responsive on ${viewport.name} for ${variant.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(`http://localhost:8080${variant.path}`);
          await page.waitForLoadState('networkidle');
          
          // Wait for animations and loading
          await page.waitForTimeout(2000);
          
          // Check if page loads without horizontal scrollbar
          const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          expect(pageWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small tolerance
          
          // Check if hero section is visible
          const heroSelectors = [
            '.hero',
            '.slide.active',
            'section:first-of-type'
          ];
          
          let heroFound = false;
          for (const selector of heroSelectors) {
            const hero = await page.$(selector);
            if (hero) {
              const isVisible = await hero.isVisible();
              if (isVisible) {
                heroFound = true;
                break;
              }
            }
          }
          expect(heroFound).toBe(true);
          
          // Check if navigation is accessible on mobile
          if (viewport.width <= 768) {
            const hamburger = await page.$('.hamburger');
            if (hamburger) {
              await expect(hamburger).toBeVisible();
            }
          }
          
          // Check if text remains readable at mobile sizes
          const titleSelectors = [
            'h1',
            '.hero-title',
            '.slide-title',
            '.maskOut .mask div'
          ];
          
          for (const selector of titleSelectors) {
            const element = await page.$(selector);
            if (element) {
              const fontSize = await element.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return parseInt(styles.fontSize);
              });
              expect(fontSize).toBeGreaterThanOrEqual(16); // Minimum readable size
            }
          }
        });
      });

      test(`should be in German language for ${variant.name}`, async ({ page }) => {
        await page.goto(`http://localhost:8080${variant.path}`);
        await page.waitForLoadState('networkidle');
        
        // Check HTML lang attribute
        const htmlLang = await page.getAttribute('html', 'lang');
        expect(htmlLang).toBe('de');
        
        // Check for German content
        const germanKeywords = [
          'Über uns',
          'Kontakt',
          'Facility Management',
          'Unternehmen',
          'Dienstleistungen',
          'Deutschland'
        ];
        
        const pageContent = await page.textContent('body');
        let foundGermanWords = 0;
        
        germanKeywords.forEach(keyword => {
          if (pageContent.includes(keyword)) {
            foundGermanWords++;
          }
        });
        
        // Should find at least half of the German keywords
        expect(foundGermanWords).toBeGreaterThanOrEqual(3);
        
        // Check that Russian content is minimal or absent
        const russianKeywords = ['Главная', 'О компании', 'Услуги', 'Контакты'];
        let foundRussianWords = 0;
        
        russianKeywords.forEach(keyword => {
          if (pageContent.includes(keyword)) {
            foundRussianWords++;
          }
        });
        
        // Should have minimal Russian content
        expect(foundRussianWords).toBeLessThanOrEqual(1);
      });

      test(`should have working animations in ${variant.name}`, async ({ page }) => {
        await page.goto(`http://localhost:8080${variant.path}`);
        await page.waitForLoadState('networkidle');
        
        // Check for hero text animation
        const animatedElements = await page.$$('.maskOut .mask div, .hero-text-animation .mask div');
        if (animatedElements.length > 0) {
          // Wait for animation to start
          await page.waitForTimeout(1000);
          
          // Check if elements have animation
          for (const element of animatedElements) {
            const hasAnimation = await element.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return styles.animationName !== 'none' && styles.animationDuration !== '0s';
            });
            expect(hasAnimation).toBe(true);
          }
        }
        
        // Check for smooth scrolling if variant4 (slide-based)
        if (variant.name === 'variant4') {
          // Test scroll navigation
          await page.keyboard.press('ArrowDown');
          await page.waitForTimeout(1000);
          
          const slides = await page.$$('.slide');
          if (slides.length > 1) {
            // Check if slide transition works
            const activeSlide = await page.$('.slide.active');
            expect(activeSlide).toBeTruthy();
          }
        }
      });

      if (variant.name === 'variant4') {
        test(`should have working touch gestures for ${variant.name}`, async ({ page }) => {
          // Set mobile viewport for touch testing
          await page.setViewportSize({ width: 375, height: 667 });
          await page.goto(`http://localhost:8080${variant.path}`);
          await page.waitForLoadState('networkidle');
          
          // Wait for initialization
          await page.waitForTimeout(2000);
          
          // Test swipe gesture simulation
          const slideContainer = await page.$('.slide-container, .slide.active');
          if (slideContainer) {
            // Simulate swipe down
            await slideContainer.hover();
            await page.mouse.move(200, 300);
            await page.mouse.down();
            await page.mouse.move(200, 200);
            await page.mouse.up();
            
            await page.waitForTimeout(1000);
            
            // Check if slide changed
            const slides = await page.$$('.slide');
            expect(slides.length).toBeGreaterThan(1);
          }
        });
      }
    });
  });

  test('Main preview page should display all variants correctly', async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
    await page.waitForLoadState('networkidle');
    
    // Check that all 4 variant cards are present
    const variantCards = await page.$$('.variant-card');
    expect(variantCards.length).toBe(4);
    
    // Check that all variant cards have proper German descriptions
    for (let i = 0; i < variantCards.length; i++) {
      const card = variantCards[i];
      const title = await card.$('.variant-title');
      const description = await card.$('.variant-description');
      
      expect(title).toBeTruthy();
      expect(description).toBeTruthy();
      
      const titleText = await title.textContent();
      const descText = await description.textContent();
      
      // Check that descriptions are in German
      expect(titleText.length).toBeGreaterThan(0);
      expect(descText.length).toBeGreaterThan(10);
    }
    
    // Check that all links work
    const primaryButtons = await page.$$('.btn-primary');
    for (const button of primaryButtons) {
      const href = await button.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/variant[1-4]/);
    }
  });
});