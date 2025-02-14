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

test('Stress Test Tool Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/stress-test-tool');
  expect(response?.status()).toBe(200);
});

test('Custom Test Modal Opens and Closes', async ({ page }) => {
  await page.goto('http://localhost:3000/stress-test-tool');

  // Click on "Add Custom Scenario"
  const addButton = page.getByRole('button', { name: /add custom scenario/i });
  await addButton.click();

  // Verify that the modal is visible
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByText(/add new stress scenario/i)).toBeVisible();

  // Verify that the close button exists
  const closeButton = page.getByRole('button', { name: /close/i });
  closeButton.click();

  // Confirm that the modal closes after
  await expect(modal).not.toBeVisible();
});

test('Financial Compilation Page Loading', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/financial-compilation');
  expect(response?.status()).toBe(200);
});
