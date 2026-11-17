import { test, expect } from '@fixtures';

test.describe('EventHub registration link', () => {
  test('registration link points to the registration route', async ({ loginPage }) => {
    await expect(loginPage.registerLink).toHaveAttribute('href', '/register');
  });
});
