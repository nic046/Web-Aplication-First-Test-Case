import type { Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class MyBookingsPage extends BasePage {
  get viewMyBookingsButton(): Locator {
    return this.page.getByRole('button', { name: 'View My Bookings' });
  }

  get firstCancelBookingButton(): Locator {
    return this.page.getByTestId('cancel-booking-btn').first();
  }

  get confirmCancellationButton(): Locator {
    return this.page.getByTestId('confirm-dialog-yes');
  }

  get dismissButton(): Locator {
    return this.page.getByRole('button', { name: 'Dismiss' });
  }

  get logoutButton(): Locator {
    return this.page.getByTestId('logout-btn');
  }

  async openMyBookings(): Promise<void> {
    await this.viewMyBookingsButton.click();
  }

  async cancelFirstBooking(): Promise<void> {
    await this.firstCancelBookingButton.click();
    await this.confirmCancellationButton.click();
    await this.dismissButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}