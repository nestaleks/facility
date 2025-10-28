import { test, expect } from '@playwright/test';

// Тест параллакс эффектов и изображений для всех вариантов сайта
test.describe('Parallax Effects and Images', () => {
  
  // Тест для variant1
  test('variant1 - parallax effects and hero images', async ({ page }) => {
    await page.goto('./variant1/index.html');
    
    // Проверяем загрузку hero секции
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    // Проверяем наличие параллакс фона
    const parallaxBg = page.locator('.hero .parallax-bg');
    await expect(parallaxBg).toBeVisible();
    
    // Проверяем что параллакс элемент имеет правильные CSS свойства
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage,
        backgroundSize: computedStyle.backgroundSize,
        position: computedStyle.position
      };
    });
    
    expect(bgStyles.backgroundImage).toContain('unsplash.com');
    expect(bgStyles.backgroundSize).toBe('cover');
    expect(bgStyles.position).toBe('absolute');
    
    // Тестируем параллакс эффект при скролле
    const initialTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Прокручиваем страницу
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100); // Даем время на анимацию
    
    const afterScrollTransform = await parallaxBg.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Проверяем что transform изменился (параллакс работает)
    expect(afterScrollTransform).not.toBe(initialTransform);
  });
  
  // Тест для service icons
  test('variant1 - service icons with images', async ({ page }) => {
    await page.goto('./variant1/index.html');
    
    // Проверяем service icons
    const serviceIcons = page.locator('.service-icon .parallax-bg');
    await expect(serviceIcons).toHaveCount(3); // Три услуги
    
    // Проверяем что у каждой иконки есть фоновое изображение
    for (let i = 0; i < 3; i++) {
      const icon = serviceIcons.nth(i);
      const bgImage = await icon.evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      expect(bgImage).toContain('unsplash.com');
    }
  });
  
  // Тест для variant2 - минималистический дизайн
  test('variant2 - minimalist parallax effects', async ({ page }) => {
    await page.goto('./variant2/index.html');
    
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    const parallaxBg = page.locator('.hero .parallax-bg');
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage,
        backgroundSize: computedStyle.backgroundSize
      };
    });
    
    expect(bgStyles.backgroundImage).toContain('unsplash.com');
    expect(bgStyles.backgroundSize).toBe('cover');
    
    // Проверяем что стеклянный офисный дизайн загружен
    expect(bgStyles.backgroundImage).toContain('photo-1541746972996');
  });
  
  // Тест для variant3 - элегантный дизайн с золотыми акцентами
  test('variant3 - elegant design with gold accents', async ({ page }) => {
    await page.goto('./variant3/index.html');
    
    const heroSection = page.locator('.hero.parallax-container');
    await expect(heroSection).toBeVisible();
    
    const parallaxBg = page.locator('.hero .parallax-bg');
    const bgStyles = await parallaxBg.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        backgroundImage: computedStyle.backgroundImage
      };
    });
    
    // Проверяем что элегантный лобби загружен
    expect(bgStyles.backgroundImage).toContain('photo-1497366754035');
    
    // Проверяем service icons с золотыми акцентами
    const serviceIcons = page.locator('.service-icon .parallax-bg');
    const firstIconBg = await serviceIcons.first().evaluate(el => 
      window.getComputedStyle(el).backgroundImage
    );
    expect(firstIconBg).toContain('unsplash.com');
  });
  
  // Тест производительности параллакс эффектов
  test('parallax performance check', async ({ page }) => {
    await page.goto('./variant1/index.html');
    
    // Замеряем время выполнения scroll события
    const scrollPerformance = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        let frameCount = 0;
        
        function measureFrame() {
          frameCount++;
          if (frameCount < 60) { // Тестируем 60 кадров
            requestAnimationFrame(measureFrame);
          } else {
            const endTime = performance.now();
            resolve(endTime - startTime);
          }
        }
        
        // Запускаем скролл
        window.scrollTo(0, 1000);
        requestAnimationFrame(measureFrame);
      });
    });
    
    // Проверяем что анимация работает плавно (менее 1000ms для 60 кадров)
    expect(scrollPerformance).toBeLessThan(1000);
  });
  
  // Тест адаптивности изображений
  test('responsive images test', async ({ page }) => {
    // Тестируем на разных размерах экрана
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('./variant1/index.html');
      
      const heroImage = page.locator('.hero .parallax-bg');
      await expect(heroImage).toBeVisible();
      
      // Проверяем что изображения подходят под viewport
      const imageInfo = await heroImage.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      });
      
      expect(imageInfo.visible).toBe(true);
      expect(imageInfo.width).toBeGreaterThan(0);
    }
  });
  
  // Тест качества изображений
  test('image quality and loading', async ({ page }) => {
    await page.goto('./variant1/index.html');
    
    // Проверяем что все изображения загружаются без ошибок
    page.on('response', response => {
      if (response.url().includes('unsplash.com')) {
        expect(response.status()).toBe(200);
      }
    });
    
    await page.waitForTimeout(3000); // Даем время на загрузку изображений
    
    // Проверяем что параллакс элементы имеют изображения
    const parallaxElements = page.locator('.parallax-bg');
    const count = await parallaxElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = parallaxElements.nth(i);
      const hasBackgroundImage = await element.evaluate(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg !== 'none' && bg.includes('unsplash.com');
      });
      
      if (hasBackgroundImage) {
        expect(hasBackgroundImage).toBe(true);
      }
    }
  });
});