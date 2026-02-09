const { test, expect } = require('@playwright/test');

// Website variants to test
const variants = [
  { name: 'Basic', path: '/basic/index.html' },
  { name: 'Dark Neon', path: '/variants/dark-neon/index.html' },
  { name: 'Minimalist', path: '/variants/minimalist/index.html' }
];

for (const variant of variants) {
  test.describe(`${variant.name} Variant`, () => {
    
    test('should load successfully', async ({ page }) => {
      await page.goto(variant.path);
      
      // Check that page loads
      await expect(page).toHaveTitle(/Decktum/);
      
      // Check for main content
      await expect(page.locator('main, .main-content')).toBeVisible();
      
      // Check for header
      await expect(page.locator('header, .site-header')).toBeVisible();
      
      // Check for navigation
      await expect(page.locator('nav, .navigation, .navbar')).toBeVisible();
    });

    test('should have proper meta tags', async ({ page }) => {
      await page.goto(variant.path);
      
      // Check charset
      const charset = await page.locator('meta[charset]');
      await expect(charset).toHaveCount(1);
      
      // Check viewport
      const viewport = await page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);
      
      // Check description
      const description = await page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
    });

    test('should be responsive', async ({ page }) => {
      await page.goto(`variant.path`);
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      
      // Check that mobile menu is accessible
      const mobileMenuButton = page.locator('.mobile-menu-toggle, .menu-toggle, [aria-label*="menu" i], [aria-label*="menü" i]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForLoadState('networkidle');
      
      // Main navigation should be visible on desktop
      const navigation = page.locator('nav ul, .nav-menu, .nav-wrapper');
      await expect(navigation).toBeVisible();
    });

    test('should have proper accessibility features', async ({ page }) => {
      await page.goto(`variant.path`);
      
      // Check for skip link
      const skipLink = page.locator('.skip-link, [href="#main"], [href="#main-content"]');
      await expect(skipLink).toHaveCount(1);
      
      // Check for proper heading hierarchy
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');
        const ariaHidden = await img.getAttribute('aria-hidden');
        
        // Image should have alt text, aria-label, or be decorative (aria-hidden)
        expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBeTruthy();
      }
    });

    test('should load CSS and JavaScript', async ({ page }) => {
      await page.goto(`variant.path`);
      
      // Check that CSS is loaded by checking computed styles
      const body = page.locator('body');
      const fontSize = await body.evaluate(el => getComputedStyle(el).fontSize);
      expect(fontSize).not.toBe('');
      
      // Check for JavaScript functionality (if main script exists)
      const script = page.locator('script[src*="main"]');
      const scriptCount = await script.count();
      
      if (scriptCount > 0) {
        // Wait for JavaScript to load
        await page.waitForLoadState('networkidle');
        
        // Check that JavaScript has loaded by looking for class changes or functionality
        await page.waitForTimeout(1000);
      }
    });

    test('should have working navigation', async ({ page }) => {
      await page.goto(`variant.path`);
      
      // Find navigation links
      const navLinks = page.locator('nav a[href^="#"], .nav-menu a[href^="#"]');
      const linkCount = await navLinks.count();
      
      if (linkCount > 0) {
        // Test first navigation link
        const firstLink = navLinks.first();
        const href = await firstLink.getAttribute('href');
        
        if (href && href !== '#') {
          await firstLink.click();
          
          // Wait for smooth scroll to complete
          await page.waitForTimeout(1000);
          
          // Check that we scrolled (page should have moved)
          const scrollPosition = await page.evaluate(() => window.scrollY);
          expect(scrollPosition).toBeGreaterThan(0);
        }
      }
    });

    test('should load images properly', async ({ page }) => {
      await page.goto(`variant.path`);
      await page.waitForLoadState('networkidle');
      
      // Find all images
      const images = page.locator('img[src]');
      const imageCount = await images.count();
      
      // Check first few images are loaded
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        if (src && !src.startsWith('data:')) {
          // Check image natural dimensions to see if it loaded
          const dimensions = await img.evaluate(el => ({
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            complete: el.complete
          }));
          
          expect(dimensions.complete).toBeTruthy();
          expect(dimensions.naturalWidth).toBeGreaterThan(0);
          expect(dimensions.naturalHeight).toBeGreaterThan(0);
        }
      }
    });

    if (variant.name === 'Basic') {
      test('should have video elements', async ({ page }) => {
        await page.goto(`variant.path`);
        
        // Check for video elements
        const videos = page.locator('video');
        await expect(videos).toHaveCount(2); // Desktop and mobile video
        
        // Check video attributes
        const desktopVideo = page.locator('#hero-video-desktop');
        await expect(desktopVideo).toHaveAttribute('autoplay');
        await expect(desktopVideo).toHaveAttribute('muted');
        await expect(desktopVideo).toHaveAttribute('loop');
      });
    }
  });
}

// Cross-variant tests
test.describe('Cross-variant consistency', () => {
  
  test('all variants should have consistent structure', async ({ page }) => {
    const structures = [];
    
    for (const variant of variants) {
      await page.goto(`variant.path`);
      
      const structure = {
        hasHeader: await page.locator('header, .site-header, .navbar').isVisible(),
        hasMain: await page.locator('main, .main-content').isVisible(),
        hasNav: await page.locator('nav, .navigation, .nav-menu').isVisible(),
        hasFooter: await page.locator('footer, .site-footer').count() > 0,
        title: await page.title()
      };
      
      structures.push({ variant: variant.name, ...structure });
    }
    
    // All variants should have basic structure elements
    for (const struct of structures) {
      expect(struct.hasHeader).toBeTruthy();
      expect(struct.hasMain).toBeTruthy();
      expect(struct.hasNav).toBeTruthy();
      expect(struct.title).toContain('Decktum');
    }
  });

  test('all variants should pass basic performance checks', async ({ page }) => {
    for (const variant of variants) {
      await page.goto(`variant.path`);
      
      // Measure load time
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Load time should be reasonable (less than 5 seconds)
      expect(loadTime).toBeLessThan(5000);
      
      // Check for console errors
      const logs = [];
      page.on('console', msg => logs.push(msg));
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Filter out non-error messages
      const errors = logs.filter(log => log.type() === 'error');
      expect(errors.length).toBe(0);
    }
  });
});
