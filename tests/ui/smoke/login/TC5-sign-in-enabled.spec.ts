import { test, expect } from '@fixtures';

test.describe('Login', () => {
  test('TC5: Sign-in button is enabled', async ({ loginPage }) => {
    await test.step('Verify the sign-in button is enabled', async () => {
      await expect(loginPage.signInButton).toBeEnabled();
    });
  });
});
