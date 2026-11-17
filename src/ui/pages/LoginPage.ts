import type { Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage {
  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get passwordInput(): Locator {
    return this.page.getByLabel('Password');
  }

  get signInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign In' });
  }

  get signInHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Sign in to EventHub' });
  }

  get registerLink(): Locator {
    return this.page.getByRole('link', { name: 'Register' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
