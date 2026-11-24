import { test, expect } from '@fixtures';

test.describe('Login', () => {
  test('TC4: Password field uses a masked input type', async ({ loginPage }) => {
    await test.step('Verify the password field is masked', async () => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });
});
