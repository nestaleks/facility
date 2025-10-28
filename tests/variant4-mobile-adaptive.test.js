import { test, expect } from '@playwright/test';

test.describe('Variant 4 - Mobile Adaptivity Tests', () => {
  const baseURL = 'file://' + process.cwd().replace(/\\/g, '/') + '/variant4/index.html';

  // Различные размеры экранов для тестирования
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Layout adaptation on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(baseURL);
      
      // Ждем загрузки страницы
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Проверяем, что лоадер исчезает
      await expect(page.locator('.loader')).toHaveClass(/hidden/);

      // Проверяем видимость основных элементов
      await expect(page.locator('.slide-container')).toBeVisible();
      await expect(page.locator('.slide.active')).toBeVisible();
      await expect(page.locator('.navigation')).toBeVisible();

      // Проверяем заголовок на читаемость
      const title = page.locator('.slide-title');
      await expect(title).toBeVisible();
      
      // Проверяем, что текст не обрезается
      const titleBox = await title.boundingBox();
      expect(titleBox.width).toBeLessThanOrEqual(width - 40); // учитываем отступы

      // Проверяем кнопки
      const ctaButton = page.locator('.cta-button');
      await expect(ctaButton).toBeVisible();
      
      // Проверяем навигацию
      const navigation = page.locator('.navigation');
      await expect(navigation).toBeVisible();
      
      const navDots = page.locator('.nav-dots');
      await expect(navDots).toBeVisible();
      
      // Проверяем, что навигация не выходит за границы экрана
      const navBox = await navigation.boundingBox();
      expect(navBox.x + navBox.width).toBeLessThanOrEqual(width);
      expect(navBox.y + navBox.height).toBeLessThanOrEqual(height);

      // Проверяем номер слайда
      const slideNumber = page.locator('.slide-number');
      await expect(slideNumber).toBeVisible();
      
      // Проверяем, что номер слайда не пересекается с навигацией
      const slideNumberBox = await slideNumber.boundingBox();
      expect(slideNumberBox.x + slideNumberBox.width).toBeLessThanOrEqual(navBox.x - 10);

      console.log(`✓ ${name}: Layout properly adapted`);
    });
  });

  test('Mobile navigation functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(baseURL);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Проверяем точки навигации
    const navDots = page.locator('.nav-dot');
    const dotsCount = await navDots.count();
    expect(dotsCount).toBe(5);

    // Проверяем активную точку
    await expect(page.locator('.nav-dot.active')).toHaveCount(1);
    
    // Кликаем по второй точке
    await navDots.nth(1).click();
    await page.waitForTimeout(1000);
    
    // Проверяем, что активная точка изменилась
    await expect(navDots.nth(1)).toHaveClass(/active/);
    await expect(page.locator('.slide').nth(1)).toHaveClass(/active/);

    // Тестируем стрелки навигации
    const nextButton = page.locator('.nav-next');
    const prevButton = page.locator('.nav-prev');
    
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();

    // Кликаем next
    await nextButton.click();
    await page.waitForTimeout(1000);
    await expect(navDots.nth(2)).toHaveClass(/active/);

    // Кликаем prev
    await prevButton.click();
    await page.waitForTimeout(1000);
    await expect(navDots.nth(1)).toHaveClass(/active/);

    console.log('✓ Mobile navigation works correctly');
  });

  test('Touch gestures simulation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
    await page.goto(baseURL);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Симулируем swipe down (должен переключить на следующий слайд)
    const slideContainer = page.locator('.slide-container');
    
    // Получаем размеры контейнера
    const box = await slideContainer.boundingBox();
    const centerX = box.x + box.width / 2;
    const startY = box.y + box.height / 3;
    const endY = box.y + (box.height * 2) / 3;

    // Симулируем swipe down
    await page.mouse.move(centerX, startY);
    await page.mouse.down();
    await page.mouse.move(centerX, endY, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(1000);
    
    // Проверяем, что слайд переключился
    await expect(page.locator('.nav-dot').nth(1)).toHaveClass(/active/);

    // Симулируем swipe up (должен вернуться к предыдущему слайду)
    await page.mouse.move(centerX, endY);
    await page.mouse.down();
    await page.mouse.move(centerX, startY, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(1000);
    
    // Проверяем, что вернулись к первому слайду
    await expect(page.locator('.nav-dot').nth(0)).toHaveClass(/active/);

    console.log('✓ Touch gestures work correctly');
  });

  test('Content readability on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5/SE (smallest)
    await page.goto(baseURL);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Проверяем, что текст читаемый
    const title = page.locator('.slide-title');
    const subtitle = page.locator('.slide-subtitle');
    const text = page.locator('.slide-text');

    await expect(title).toBeVisible();
    await expect(subtitle).toBeVisible();

    // Проверяем размеры шрифтов
    const titleStyles = await title.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight
      };
    });

    // Размер шрифта должен быть не менее 24px на маленьких экранах
    const titleFontSize = parseInt(titleStyles.fontSize);
    expect(titleFontSize).toBeGreaterThanOrEqual(24);

    // Проверяем, что элементы не перекрываются
    const titleBox = await title.boundingBox();
    const subtitleBox = await subtitle.boundingBox();
    
    expect(subtitleBox.y).toBeGreaterThan(titleBox.y + titleBox.height);

    // Проверяем кнопки
    const button = page.locator('.cta-button');
    await expect(button).toBeVisible();
    
    const buttonBox = await button.boundingBox();
    expect(buttonBox.width).toBeGreaterThanOrEqual(120); // Минимальная ширина для touch
    expect(buttonBox.height).toBeGreaterThanOrEqual(44); // Минимальная высота для touch

    console.log('✓ Content is readable on small screens');
  });

  test('Performance on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Измеряем время загрузки
    const startTime = Date.now();
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Должно загружаться менее чем за 3 секунды

    // Проверяем, что изображения загружаются
    const backgroundImages = page.locator('.parallax-bg');
    const imageCount = await backgroundImages.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = backgroundImages.nth(i);
      const bgImage = await img.evaluate(el => window.getComputedStyle(el).backgroundImage);
      expect(bgImage).not.toBe('none');
    }

    // Проверяем плавность анимаций
    await page.locator('.nav-dot').nth(1).click();
    await page.waitForTimeout(100);
    
    // Во время анимации должны быть видны transition классы
    const slide = page.locator('.slide').nth(1);
    await expect(slide).toHaveClass(/active/);

    console.log('✓ Performance is acceptable on mobile');
  });

  test('Orientation change handling', async ({ page }) => {
    // Портретная ориентация
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('.slide.active')).toBeVisible();
    
    // Поворачиваем в ландшафт
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // Проверяем, что layout адаптировался
    await expect(page.locator('.slide.active')).toBeVisible();
    await expect(page.locator('.navigation')).toBeVisible();

    const navigation = page.locator('.navigation');
    const navBox = await navigation.boundingBox();
    
    // Навигация должна оставаться в пределах экрана
    expect(navBox.x + navBox.width).toBeLessThanOrEqual(667);
    expect(navBox.y + navBox.height).toBeLessThanOrEqual(375);

    // Возвращаемся в портрет
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page.locator('.slide.active')).toBeVisible();

    console.log('✓ Orientation changes handled correctly');
  });
});