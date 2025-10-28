import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

test.describe('Детальная проверка анимаций', () => {
  test('Проверка скролл-анимаций во всех вариантах', async ({ page }) => {
    const variants = ['variant1', 'variant2', 'variant3'];
    
    for (const variant of variants) {
      console.log(`\n=== Тестирование ${variant} ===`);
      
      const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/${variant}/full-page.html`;
      await page.goto(filePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Проверяем загрузку новой системы анимаций
      const systemLoaded = await page.evaluate(() => {
        return typeof window.scrollAnimations !== 'undefined';
      });
      
      expect(systemLoaded).toBe(true);
      console.log(`✓ Система анимаций загружена`);
      
      // Получаем начальную статистику
      const initialStats = await page.evaluate(() => {
        return window.scrollAnimations.getStats();
      });
      
      console.log(`📊 Начальная статистика:`, initialStats);
      
      // Проверяем видимые элементы в viewport
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      
      // Скроллим по странице поэтапно
      const scrollSteps = 5;
      const scrollStep = viewportHeight / scrollSteps;
      
      for (let i = 1; i <= scrollSteps; i++) {
        await page.evaluate((step) => {
          window.scrollTo(0, step);
        }, scrollStep * i);
        
        await page.waitForTimeout(500); // Ждем срабатывания анимаций
        
        const stats = await page.evaluate(() => {
          return window.scrollAnimations.getStats();
        });
        
        console.log(`📏 Шаг ${i} (скролл до ${scrollStep * i}px):`, stats);
      }
      
      // Финальная статистика
      const finalStats = await page.evaluate(() => {
        return window.scrollAnimations.getStats();
      });
      
      console.log(`🏁 Финальная статистика:`, finalStats);
      
      // Проверяем, что анимации срабатывают
      expect(finalStats.completed).toBeGreaterThan(initialStats.completed);
      expect(finalStats.animated).toBeGreaterThan(0);
      
      // Проверяем CSS классы
      const animatedElements = await page.locator('.animated-in').count();
      const visibleElements = await page.locator('.is-visible').count();
      
      expect(animatedElements).toBe(finalStats.animated);
      expect(visibleElements).toBe(finalStats.animated);
      
      console.log(`✓ Все проверки пройдены для ${variant}`);
    }
  });
  
  test('Проверка задержек анимации', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/full-page.html`;
    await page.goto(filePath);
    await page.waitForLoadState('networkidle');
    
    // Включаем debug режим
    await page.evaluate(() => {
      if (window.scrollAnimations) {
        window.scrollAnimations.options.debug = true;
      }
    });
    
    // Ищем элементы с data-delay
    const elementsWithDelay = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-delay]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        className: el.className,
        delay: el.dataset.delay
      }));
    });
    
    console.log('Элементы с задержкой:', elementsWithDelay);
    
    // Скроллим до первого элемента с задержкой
    if (elementsWithDelay.length > 0) {
      await page.evaluate(() => {
        window.scrollTo(0, window.innerHeight);
      });
      
      await page.waitForTimeout(2000); // Ждем максимальную задержку
      
      const animatedCount = await page.locator('.animated-in').count();
      expect(animatedCount).toBeGreaterThan(0);
    }
  });
  
  test('Проверка производительности анимаций', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant3/full-page.html`;
    await page.goto(filePath);
    await page.waitForLoadState('networkidle');
    
    // Измеряем время инициализации
    const initTime = await page.evaluate(() => {
      const start = performance.now();
      // Эмулируем повторную инициализацию
      if (window.scrollAnimations) {
        window.scrollAnimations.refresh();
      }
      const end = performance.now();
      return end - start;
    });
    
    console.log(`⏱️ Время инициализации: ${initTime.toFixed(2)}ms`);
    expect(initTime).toBeLessThan(100); // Должно быть быстрее 100ms
    
    // Измеряем производительность скролла
    const scrollStart = await page.evaluate(() => performance.now());
    
    for (let i = 0; i < 10; i++) {
      await page.evaluate((step) => {
        window.scrollBy(0, 100);
      });
      await page.waitForTimeout(50);
    }
    
    const scrollEnd = await page.evaluate(() => performance.now());
    const scrollTime = scrollEnd - scrollStart;
    
    console.log(`⏱️ Время скролла с анимациями: ${scrollTime.toFixed(2)}ms`);
    expect(scrollTime).toBeLessThan(2000); // Должно быть разумным
  });
});