import type { Page } from '@playwright/test';
import { test as base, expect } from '@playwright/test';
import { users } from '@data/auth.data';
import { BookingPage } from '@pages/BookingPage';
import { EventCatalogPage } from '@pages/EventCatalogPage';
import { LoginPage } from '@pages/LoginPage';
import { MyBookingsPage } from '@pages/MyBookingsPage';

export type AppFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
  eventCatalogPage: EventCatalogPage;
  bookingPage: BookingPage;
  myBookingsPage: MyBookingsPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate('/login');
    await use(loginPage);
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.login(users.appUser.email, users.appUser.password);
    await use(page);
  },
  eventCatalogPage: async ({ authenticatedPage }, use) => {
    await use(new EventCatalogPage(authenticatedPage));
  },
  bookingPage: async ({ authenticatedPage }, use) => {
    await use(new BookingPage(authenticatedPage));
  },
  myBookingsPage: async ({ authenticatedPage }, use) => {
    await use(new MyBookingsPage(authenticatedPage));
  },
});

export { expect };
