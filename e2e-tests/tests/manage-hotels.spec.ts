import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173';

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in  button
  await page.getByRole('link', { name: 'Sign In' }).click();

  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.locator('[name=email]').fill('1@1.com');
  await page.locator('[name=password]').fill('password123');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Sign in Successful!')).toBeVisible();
});

test('should allow user to add a hotel', async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);

  await page.locator('[name="name"]').fill('Test Hotel');
  await page.locator('[name="city"]').fill('Test city');
  await page.locator('[name="country"]').fill('Test country');
  await page
    .locator('[name="description"]')
    .fill('this is a Test description ');
  await page.locator('[name="pricePerNight"]').fill('100');
  await page.locator('[name="country"]').fill('Test country');
  await page.selectOption('select[name="starRating"]', '3');
  await page.getByText('Budget').click();
  await page.getByLabel('Free Wifi').check();
  await page.getByLabel('Parking').check();
  await page.locator('[name="adultCount"]').fill('2');
  await page.locator('[name="childCount"]').fill('2');

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, 'files', '11.jpg'),
    path.join(__dirname, 'files', '12.jpg'),
  ]);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Hotel Saved!')).toBeVisible();
});

test('should display hotels', async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText('Test Hotel')).toBeVisible();
  await expect(page.getByText('this is a Test description')).toBeVisible();
  await expect(page.getByText('Test city, Test country')).toBeVisible();
  await expect(page.getByText('Budget')).toBeVisible();
  await expect(page.getByText('$100 per night')).toBeVisible();
  await expect(page.getByText('2 adults, 2 children')).toBeVisible();

  await expect(page.getByRole('link', { name: 'View Details' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Hotel' })).toBeVisible();
});

test('should edit hotel', async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await page.getByRole('link', { name: 'View Details' }).click();

  await page.waitForSelector('[name="name"]', { state: 'attached' });
  await expect(page.locator('[name="name"]')).toHaveValue('Test Hotel');
  await page.locator('[name="name"]').fill('updated test hotel');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Hotel Saved!')).toBeVisible();
  page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue('');
});
