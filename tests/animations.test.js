import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Функция для проверки анимаций
async function checkAnimations(page, variant) {
  // Ждем загрузки страницы
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Проверяем наличие элементов с классами анимации
  const animationSelectors = [
    '.fade-in-up',
    '.fade-in-left', 
    '.fade-in-right',
    '.animate-on-scroll',
    '.service-card'
  ];

  let foundElements = 0;
  
  for (const selector of animationSelectors) {
    const elements = await page.locator(selector).count();
    if (elements > 0) {
      foundElements += elements;
      console.log(`${variant}: Найдено ${elements} элементов с селектором ${selector}`);
    }
  }

  // Проверяем начальное состояние (элементы должны быть скрыты)
  const hiddenElements = await page.locator('.fade-in-up:not(.animated-in)').count();
  console.log(`${variant}: Скрытых элементов: ${hiddenElements}`);
  
  // Проверяем наличие data-атрибутов новой системы
  const pendingElements = await page.locator('[data-scroll-animation="pending"]').count();
  console.log(`${variant}: Элементов в ожидании анимации: ${pendingElements}`);

  // Скроллим страницу и проверяем появление анимаций
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight / 2);
  });
  
  await page.waitForTimeout(1000);

  // Проверяем, что элементы начали анимироваться (новая система использует .animated-in)
  const animatedElements = await page.locator('.animated-in').count();
  const visibleElements = await page.locator('.is-visible').count();
  console.log(`${variant}: Анимированных элементов после скролла: ${animatedElements}`);
  console.log(`${variant}: Видимых элементов: ${visibleElements}`);

  return {
    totalElements: foundElements,
    hiddenElements,
    animatedElements,
    visibleElements,
    pendingElements
  };
}

test.describe('Анимации при скролле', () => {
  test('Variant 1 - анимации работают корректно', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant1/full-page.html`;
    await page.goto(filePath);
    
    const results = await checkAnimations(page, 'Variant 1');
    
    // Проверяем, что есть элементы для анимации
    expect(results.totalElements).toBeGreaterThan(0);
    
    // Проверяем, что после скролла появились анимированные элементы
    expect(results.animatedElements).toBeGreaterThan(0);
  });

  test('Variant 2 - анимации работают корректно', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant2/full-page.html`;
    await page.goto(filePath);
    
    const results = await checkAnimations(page, 'Variant 2');
    
    expect(results.totalElements).toBeGreaterThan(0);
    expect(results.animatedElements).toBeGreaterThan(0);
  });

  test('Variant 3 - анимации работают корректно', async ({ page }) => {
    const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/variant3/full-page.html`;
    await page.goto(filePath);
    
    const results = await checkAnimations(page, 'Variant 3');
    
    expect(results.totalElements).toBeGreaterThan(0);
    expect(results.animatedElements).toBeGreaterThan(0);
  });

  test('Проверка работы скриптов анимации', async ({ page }) => {
    const variants = ['variant1', 'variant2', 'variant3'];
    
    for (const variant of variants) {
      const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/${variant}/full-page.html`;
      await page.goto(filePath);
      await page.waitForLoadState('networkidle');

      // Проверяем загрузку скриптов
      const scriptErrors = await page.evaluate(() => {
        return window.scriptErrors || [];
      });
      
      console.log(`${variant}: Ошибки скриптов:`, scriptErrors);
      
      // Проверяем наличие Intersection Observer
      const hasIntersectionObserver = await page.evaluate(() => {
        return 'IntersectionObserver' in window;
      });
      
      expect(hasIntersectionObserver).toBe(true);
      
      // Проверяем наличие новой системы анимаций
      const hasNewAnimationSystem = await page.evaluate(() => {
        return typeof window.scrollAnimations !== 'undefined';
      });
      
      console.log(`${variant}: Новая система анимаций загружена:`, hasNewAnimationSystem);
      
      // Получаем статистику анимаций
      const animationStats = await page.evaluate(() => {
        return window.scrollAnimations ? window.scrollAnimations.getStats() : null;
      });
      
      console.log(`${variant}: Статистика анимаций:`, animationStats);
    }
  });
});