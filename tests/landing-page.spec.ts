import { test, expect } from '@playwright/test';

test('landing page has expected title', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000');

  // Check if the title is correct
  await expect(page).toHaveTitle('Expected Title');

  // Check if a specific element is visible on the landing page
  const element = page.locator('selector-for-element');
  await expect(element).toBeVisible();
});
