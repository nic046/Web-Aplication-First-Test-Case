import { test, expect } from '@fixtures';
import { EventHubApi } from '@api/eventhub-api';
import { users } from '@data/auth.data';
import { buildEventPayload } from '@data/events.data';

type ApiEnvelope<T> = { success: boolean; data: T };
type EventRecord = { id: number; title: string; category: string };
type BookingRecord = { id: number; eventId: number; quantity: number; status: string };

const cleanUpResource = async (api: EventHubApi, path: string): Promise<void> => {
  const response = await api.delete(path);
  if (response.status() !== 200 && response.status() !== 404) {
    throw new Error(`API cleanup failed for ${path} with HTTP ${response.status()}`);
  }
};

test.describe('Bookings', () => {
  test('TC7: Create, read, and delete a booking through the API', { tag: '@mutates-data' }, async ({ request }, testInfo) => {
    const api = await EventHubApi.authenticate(request);
    let eventId: number | undefined;
    let bookingId: number | undefined;
    let bookingDeleted = false;
    let eventDeleted = false;

    try {
      await test.step('Create a temporary event precondition', async () => {
        const response = await api.post('/events', buildEventPayload('booking', testInfo.parallelIndex));
        expect(response.status()).toBe(201);
        const envelope = (await response.json()) as ApiEnvelope<EventRecord>;
        eventId = envelope.data.id;
        expect(Number.isInteger(eventId)).toBe(true);
      });

      await test.step('Create and read back the booking', async () => {
        const createResponse = await api.post('/bookings', {
          eventId,
          customerName: 'Lifecycle API Test',
          customerEmail: users.appUser.email,
          customerPhone: '5550100199',
          quantity: 1,
        });
        expect(createResponse.status()).toBe(201);
        const created = (await createResponse.json()) as ApiEnvelope<BookingRecord>;
        expect(created.success).toBe(true);
        bookingId = created.data.id;
        expect(Number.isInteger(bookingId)).toBe(true);

        const readResponse = await api.get(`/bookings/${bookingId}`);
        expect(readResponse.status()).toBe(200);
        const read = (await readResponse.json()) as ApiEnvelope<BookingRecord>;
        expect(read.success).toBe(true);
        expect(read.data.eventId).toBe(eventId);
        expect(read.data.quantity).toBe(1);
        expect(read.data.status).toBe('confirmed');
      });

      await test.step('Delete the booking and verify the postcondition', async () => {
        const response = await api.delete(`/bookings/${bookingId}`);
        expect(response.status()).toBe(200);
        bookingDeleted = true;
        const postcondition = await api.get(`/bookings/${bookingId}`);
        expect(postcondition.status()).toBe(404);
      });

      await test.step('Delete the temporary event and verify the postcondition', async () => {
        const response = await api.delete(`/events/${eventId}`);
        expect(response.status()).toBe(200);
        eventDeleted = true;
        const postcondition = await api.get(`/events/${eventId}`);
        expect(postcondition.status()).toBe(404);
      });
    } finally {
      if (bookingId !== undefined && !bookingDeleted) {
        await cleanUpResource(api, `/bookings/${bookingId}`);
      }
      if (eventId !== undefined && !eventDeleted) {
        await cleanUpResource(api, `/events/${eventId}`);
      }
    }
  });
});
