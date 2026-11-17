import type { Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class BookingPage extends BasePage {
  get increaseTicketButton(): Locator {
    return this.page.getByRole('button', { name: '+' });
  }

  get ticketPrices(): Locator {
    return this.page.locator('span');
  }

  get fullNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Full Name*' });
  }

  get customerEmailInput(): Locator {
    return this.page.getByTestId('customer-email');
  }

  get phoneNumberInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Phone Number*' });
  }

  get confirmBookingButton(): Locator {
    return this.page.getByRole('button', { name: 'Confirm Booking' });
  }

  async increaseTicketQuantity(): Promise<void> {
    await this.increaseTicketButton.click();
  }

  async selectTicketPrice(price: number): Promise<void> {
    const pricePattern = new RegExp(`^\\$${price}$`);
    await this.ticketPrices.filter({ hasText: pricePattern }).click();
  }

  async fillCustomerDetails(customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
  }): Promise<void> {
    await this.fullNameInput.fill(customer.fullName);
    await this.customerEmailInput.fill(customer.email);
    await this.phoneNumberInput.fill(customer.phoneNumber);
  }

  async confirmBooking(): Promise<void> {
    await this.confirmBookingButton.click();
  }
}