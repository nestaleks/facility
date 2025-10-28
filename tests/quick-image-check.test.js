import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

test.describe('Quick Image Check', () => {
  
  test('All variants have hero images', async ({ page }) => {
    const variants = [
      { name: 'variant1', expected: 'photo-1497366216548' },
      { name: 'variant2', expected: 'photo-1541746972996' }, 
      { name: 'variant3', expected: 'photo-1497366754035' }
    ];
    
    for (const variant of variants) {
      const filePath = `file:///${projectRoot.replace(/\\/g, '/')}/${variant.name}/index.html`;
      await page.goto(filePath);
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Даем время на загрузку JS
      
      const heroBackground = await page.locator('.hero .parallax-bg').evaluate(el => 
        window.getComputedStyle(el).backgroundImage
      );
      
      console.log(`${variant.name} hero background:`, heroBackground);
      
      // Проверяем что изображение есть
      expect(heroBackground).toContain('unsplash.com');
      expect(heroBackground).toContain(variant.expected);
      
      console.log(`✅ ${variant.name}: Hero image loaded correctly`);
    }
  });
});