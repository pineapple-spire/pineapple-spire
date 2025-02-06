import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('Home Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/');
  expect(response?.status()).toBe(200);
});

test('About Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/about');
  expect(response?.status()).toBe(200);
});

test('Browse Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/browse');
  expect(response?.status()).toBe(200);
});

test('Financial Compilation Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/financial-compilation');
  expect(response?.status()).toBe(200);
});
