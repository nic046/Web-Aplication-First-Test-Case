import { test, expect } from '@fixtures';

test.describe('Login', () => {
  test('TC3: Sign-in form displays email and password fields', async ({ loginPage }) => {
    await test.step('Verify the email field is visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
    });

    await test.step('Verify the password field is visible', async () => {
      await expect(loginPage.passwordInput).toBeVisible();
    });
  });
});
