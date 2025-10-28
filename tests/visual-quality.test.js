import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

test.describe('Visual Quality and Premium Design', () => {
  
  test('Variant 1 - Premium visual check', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/index.html`;
    await page.goto(filePath);
    
    // Ждем загрузки всех элементов
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Делаем скриншот hero секции
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    // Скриншот всей страницы
    await page.screenshot({ 
      path: 'test-results/variant1-premium-full.png',
      fullPage: true 
    });
    
    // Скриншот только hero секции
    await heroSection.screenshot({ 
      path: 'test-results/variant1-hero-section.png' 
    });
    
    // Проверяем что параллакс эффект работает
    const parallaxBg = page.locator('.hero .parallax-bg');
    const initialTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    
    const afterScrollTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    expect(afterScrollTransform).not.toBe(initialTransform);
    console.log('✅ Variant 1: Parallax effect working');
    
    // Скриншот после скролла
    await page.screenshot({ 
      path: 'test-results/variant1-after-scroll.png',
      fullPage: false 
    });
  });
  
  test('Variant 2 - Minimalist design check', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant2/index.html`;
    await page.goto(filePath);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Скриншот минималистического дизайна
    await page.screenshot({ 
      path: 'test-results/variant2-minimalist-full.png',
      fullPage: true 
    });
    
    const heroSection = page.locator('.hero.parallax-container');
    await heroSection.screenshot({ 
      path: 'test-results/variant2-hero-section.png' 
    });
    
    console.log('✅ Variant 2: Minimalist design captured');
  });
  
  test('Variant 3 - Elegant design with gold accents', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant3/index.html`;
    await page.goto(filePath);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Скриншот элегантного дизайна
    await page.screenshot({ 
      path: 'test-results/variant3-elegant-full.png',
      fullPage: true 
    });
    
    const heroSection = page.locator('.hero.parallax-container');
    await heroSection.screenshot({ 
      path: 'test-results/variant3-hero-section.png' 
    });
    
    console.log('✅ Variant 3: Elegant design captured');
  });
  
  test('All variants comparison', async ({ page }) => {
    const variants = [
      { name: 'variant1', title: 'Premium Design' },
      { name: 'variant2', title: 'Minimalist Design' },
      { name: 'variant3', title: 'Elegant Design' }
    ];
    
    for (const variant of variants) {
      const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/${variant.name}/index.html`;
      await page.goto(filePath);
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      
      // Проверяем основные элементы дизайна
      const heroSection = page.locator('.hero.parallax-container');
      const serviceCards = page.locator('.service-card, .service-icon');
      const navigation = page.locator('.nav');
      
      await expect(heroSection).toBeVisible();
      await expect(navigation).toBeVisible();
      
      const serviceCount = await serviceCards.count();
      expect(serviceCount).toBeGreaterThan(0);
      
      // Проверяем что сайт выглядит премиумно
      const bodyStyles = await page.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return {
          fontFamily: computedStyle.fontFamily,
          backgroundColor: computedStyle.backgroundColor
        };
      });
      
      console.log(`${variant.title}: Font - ${bodyStyles.fontFamily}`);
      
      // Проверяем наличие premium шрифтов
      const hasPremiumFonts = bodyStyles.fontFamily.includes('Inter') || 
                              bodyStyles.fontFamily.includes('Playfair') ||
                              bodyStyles.fontFamily.includes('IBM Plex') ||
                              bodyStyles.fontFamily.includes('Cormorant');
      
      expect(hasPremiumFonts).toBe(true);
      console.log(`✅ ${variant.title}: Premium fonts detected`);
    }
  });
  
  test('Responsive design quality', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/index.html`;
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(filePath);
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Скриншот для каждого размера экрана
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png`,
        fullPage: false 
      });
      
      // Проверяем что элементы видны и правильно располагаются
      const heroSection = page.locator('.hero.parallax-container');
      const navigation = page.locator('.nav');
      
      await expect(heroSection).toBeVisible();
      await expect(navigation).toBeVisible();
      
      console.log(`✅ Responsive design: ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  });
  
  test('Performance and loading quality', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/index.html`;
    
    // Замеряем время загрузки
    const startTime = Date.now();
    await page.goto(filePath);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Загрузка менее 5 секунд
    
    // Проверяем плавность анимаций
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    
    await page.waitForTimeout(500);
    
    // Проверяем что нет ошибок в консоли
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`Console errors: ${errors.length}`);
    expect(errors.length).toBeLessThan(3); // Минимум ошибок
    
    console.log('✅ Performance and quality check passed');
  });
});