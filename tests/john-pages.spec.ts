import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

const pages = [
  {
    name: 'About',
    url: 'http://localhost:3000/about',
  },
  {
    name: 'Audit Data',
    url: 'http://localhost:3000/audit-data',
  },
  {
    name: 'Change Password',
    url: 'http://localhost:3000/auth/change-password',
  },
  {
    name: 'Contact Us',
    url: 'http://localhost:3000/contact',
  },
  {
    name: 'Financial Compilation',
    url: 'http://localhost:3000/financial-compilation',
  },
  {
    name: 'Home',
    url: 'http://localhost:3000/',
  },
  {
    name: 'Report Problem',
    url: 'http://localhost:3000/report',
  },
  {
    name: 'Stress Test Tool',
    url: 'http://localhost:3000/stress-test-tool',
  },
];

test.describe('Availability Acceptance Tests', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} Page Loading`, async ({ page }) => {
      const response = await page.goto(pageInfo.url);
      expect(response?.status()).toBe(200);
    });
  }

  // 2-sec delay to make test less flaky.
  test('Admin Access Redirect', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('http://localhost:3000/auth/signin');
  });
});

test.describe('Navigation / Footer Tests', () => {
  const baseURL = 'http://localhost:3000/';

  test('Nav Bar Existence', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('Footer Existence', async ({ page }) => {
    await page.goto(baseURL);
    const footer = page.locator('footer');

    await expect(footer).toBeVisible();
    await expect(page.getByText('Spire Hawaii LLP 2025')).toBeVisible();
  });
});
