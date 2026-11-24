import { test, expect } from '@fixtures';

test.describe('Login', () => {
  test('TC2: Sign-in page shows its heading', async ({ loginPage }) => {
    await test.step('Verify the sign-in heading is visible', async () => {
      await expect(loginPage.signInHeading).toBeVisible();
    });
  });
});
