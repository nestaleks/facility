import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

test.describe('Image Quality and Parallax Effects', () => {
  
  test('Variant 1 - Hero images and parallax effects', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/index.html`;
    await page.goto(filePath);
    
    // Проверяем загрузку hero секции
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    // Проверяем наличие параллакс фона
    const parallaxBg = page.locator('.hero .parallax-bg');
    await expect(parallaxBg).toBeVisible();
    
    // Проверяем CSS свойства фонового изображения
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage,
        backgroundSize: computedStyle.backgroundSize,
        backgroundPosition: computedStyle.backgroundPosition,
        position: computedStyle.position
      };
    });
    
    console.log('Variant 1 Hero Background:', bgStyles.backgroundImage);
    
    expect(bgStyles.backgroundImage).toContain('unsplash.com');
    expect(bgStyles.backgroundSize).toBe('cover');
    expect(bgStyles.backgroundPosition).toContain('center');
    expect(bgStyles.position).toBe('absolute');
    
    // Проверяем service icons
    const serviceIcons = page.locator('.service-icon .parallax-bg');
    const iconCount = await serviceIcons.count();
    expect(iconCount).toBeGreaterThan(0);
    
    for (let i = 0; i < iconCount; i++) {
      const icon = serviceIcons.nth(i);
      const iconBg = await icon.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      if (iconBg !== 'none') {
        expect(iconBg).toContain('unsplash.com');
      }
    }
  });
  
  test('Variant 2 - Minimalist images', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant2/index.html`;
    await page.goto(filePath);
    
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    const parallaxBg = page.locator('.hero .parallax-bg');
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage
      };
    });
    
    console.log('Variant 2 Hero Background:', bgStyles.backgroundImage);
    expect(bgStyles.backgroundImage).toContain('unsplash.com');
  });
  
  test('Variant 3 - Elegant images with gold accents', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant3/index.html`;
    await page.goto(filePath);
    
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    const parallaxBg = page.locator('.hero .parallax-bg');
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage
      };
    });
    
    console.log('Variant 3 Hero Background:', bgStyles.backgroundImage);
    expect(bgStyles.backgroundImage).toContain('unsplash.com');
  });
  
  test('Parallax movement test', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/index.html`;
    await page.goto(filePath);
    
    const parallaxBg = page.locator('.hero .parallax-bg');
    await expect(parallaxBg).toBeVisible();
    
    // Получаем начальную позицию
    const initialTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Прокручиваем страницу
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(100);
    
    // Получаем позицию после скролла
    const afterScrollTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    console.log('Initial transform:', initialTransform);
    console.log('After scroll transform:', afterScrollTransform);
    
    // Проверяем что transform изменился
    expect(afterScrollTransform).not.toBe(initialTransform);
  });
  
  test('Premium quality check', async ({ page }) => {
    const variants = ['variant1', 'variant2', 'variant3'];
    
    for (const variant of variants) {
      const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/${variant}/index.html`;
      await page.goto(filePath);
      
      // Проверяем что все параллакс элементы имеют хорошее качество
      const parallaxElements = page.locator('.parallax-bg');
      const count = await parallaxElements.count();
      
      let imagesWithBackground = 0;
      
      for (let i = 0; i < count; i++) {
        const element = parallaxElements.nth(i);
        const bgImage = await element.evaluate(el => 
          window.getComputedStyle(el).backgroundImage
        );
        
        if (bgImage !== 'none' && bgImage.includes('unsplash.com')) {
          imagesWithBackground++;
          
          // Проверяем качество параметров Unsplash
          expect(bgImage).toMatch(/w=\d+/); // Есть параметр ширины
          expect(bgImage).toMatch(/h=\d+/); // Есть параметр высоты
          expect(bgImage).toContain('fit=crop'); // Есть обрезка
        }
      }
      
      console.log(`${variant}: ${imagesWithBackground} elements with quality images`);
      expect(imagesWithBackground).toBeGreaterThan(0);
    }
  });
});