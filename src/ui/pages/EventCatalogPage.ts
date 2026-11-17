import type { Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class EventCatalogPage extends BasePage {
  get eventArticles(): Locator {
    return this.page.getByRole('article');
  }

  async openBookingForEvent(eventCardText: string): Promise<void> {
    await this.eventArticles
      .filter({ hasText: eventCardText })
      .getByTestId('book-now-btn')
      .click();
  }
}