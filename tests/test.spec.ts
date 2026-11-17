import { test, expect } from '@fixtures';

test.describe('EventHub sign-in', () => {
  test('sign-in page shows its heading', async ({ loginPage }) => {
    await expect(loginPage.signInHeading).toBeVisible();
  });

  test('sign-in form displays email and password fields', async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('password field uses a masked input type', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('sign-in button is enabled', async ({ loginPage }) => {
    await expect(loginPage.signInButton).toBeEnabled();
  });
});