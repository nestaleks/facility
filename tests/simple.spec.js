const { test, expect } = require('@playwright/test');

test.describe('Simple Website Tests', () => {
  
  test('Basic variant loads successfully', async ({ page }) => {
    await page.goto('/basic/index.html');
    
    // Check that page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Decktum');
    
    // Check for main structure
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('header, .site-header')).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/basic-variant.png', fullPage: true });
  });

  test('Dark Neon variant loads successfully', async ({ page }) => {
    await page.goto('/variants/dark-neon/index.html');
    
    // Check that page has a title  
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Decktum');
    
    // Check for main structure
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/dark-neon-variant.png', fullPage: true });
  });

  test('Minimalist variant loads successfully', async ({ page }) => {
    await page.goto('/variants/minimalist/index.html');
    
    // Check that page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Decktum');
    
    // Check for main structure
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/minimalist-variant.png', fullPage: true });
  });

  test('Basic variant - mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/basic/index.html');
    
    // Check that mobile menu button is visible
    const mobileButton = page.locator('.mobile-menu-toggle, .menu-toggle');
    await expect(mobileButton).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/basic-mobile.png', fullPage: true });
  });

  test('Check CSS loading in basic variant', async ({ page }) => {
    await page.goto('/basic/index.html');
    
    // Check that CSS is loaded by verifying computed styles
    const body = page.locator('body');
    const fontSize = await body.evaluate(el => getComputedStyle(el).fontSize);
    expect(fontSize).toBeTruthy();
    expect(fontSize).not.toBe('');
  });
});
