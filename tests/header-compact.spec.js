const { test, expect } = require('@playwright/test');

test.describe('Compact Header Tests', () => {
  test('Verify compact header dimensions', async ({ page }) => {
    await page.goto('/basic/index.html');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get header element dimensions (without dropdown open)
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    // Close any open dropdowns by clicking outside
    await page.click('body', { position: { x: 10, y: 10 } });

    // Get header container dimensions
    const headerContainer = page.locator('.header-container');
    const containerBox = await headerContainer.boundingBox();
    
    console.log('New compact header container dimensions:', containerBox);

    // Check computed styles
    const containerStyles = await headerContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        padding: styles.padding,
        minHeight: styles.minHeight
      };
    });
    console.log('New compact container styles:', containerStyles);

    // Take a screenshot without hovering (no dropdown)
    await page.screenshot({ 
      path: 'test-results/header-compact.png',
      clip: { x: 0, y: 0, width: 1200, height: 100 }
    });

    // Test that header container is more compact now
    expect(containerBox.height).toBeLessThan(100); // Should be less than 100px now (was 604px)
    
    // Test logo size
    const logo = page.locator('.logo svg');
    const logoBox = await logo.boundingBox();
    console.log('Logo dimensions:', logoBox);
    expect(logoBox.height).toBeLessThan(45); // Logo should be smaller

    // Test nav spacing
    const navMenu = page.locator('.nav-menu');
    const navStyles = await navMenu.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        gap: styles.gap
      };
    });
    console.log('Navigation gap:', navStyles);

    // Test full page with compact header
    await page.screenshot({ 
      path: 'test-results/full-page-compact.png',
      fullPage: true 
    });
  });

  test('Test mobile header compactness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/basic/index.html');
    await page.waitForLoadState('networkidle');

    const headerContainer = page.locator('.header-container');
    const containerBox = await headerContainer.boundingBox();
    
    console.log('Mobile header container dimensions:', containerBox);
    
    // Mobile header should be even more compact
    expect(containerBox.height).toBeLessThan(70);

    await page.screenshot({ 
      path: 'test-results/header-compact-mobile.png',
      clip: { x: 0, y: 0, width: 375, height: 100 }
    });
  });
});