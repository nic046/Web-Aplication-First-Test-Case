import { test, expect } from '@fixtures';

test.describe('Login', () => {
  test('TC1: Registration link points to the registration route', async ({ loginPage }) => {
    await test.step('Verify the registration link target', async () => {
      await expect(loginPage.registerLink).toHaveAttribute('href', '/register');
    });
  });
});
