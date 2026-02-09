const { test, expect } = require('@playwright/test');

test.describe('Header Size Analysis', () => {
  test('Analyze current header dimensions', async ({ page }) => {
    await page.goto('/basic/index.html');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get header element
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    // Get header dimensions
    const headerBox = await header.boundingBox();
    console.log('Header dimensions:', headerBox);

    // Get header container dimensions
    const headerContainer = page.locator('.header-container');
    const containerBox = await headerContainer.boundingBox();
    console.log('Header container dimensions:', containerBox);

    // Check computed styles
    const headerHeight = await header.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        padding: styles.padding,
        minHeight: styles.minHeight
      };
    });
    console.log('Header computed styles:', headerHeight);

    const containerStyles = await headerContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        padding: styles.padding,
        minHeight: styles.minHeight
      };
    });
    console.log('Container computed styles:', containerStyles);

    // Take a screenshot focused on header
    await page.screenshot({ 
      path: 'test-results/header-current.png',
      clip: { x: 0, y: 0, width: 1200, height: 200 }
    });
  });
});