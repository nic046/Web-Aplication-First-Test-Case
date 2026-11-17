import { randomUUID } from 'node:crypto';
import { test, expect } from '@fixtures';
import { EventHubApi } from '@api/eventhub-api';
import { users } from '@data/auth.data';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

type EventRecord = {
  id: number;
  title: string;
  category: string;
};

type BookingRecord = {
  id: number;
  eventId: number;
  customerName: string;
  quantity: number;
  status: string;
};

const eventPayload = (title: string, totalSeats: number) => ({
  title,
  category: 'Workshop',
  venue: 'Online',
  city: 'Remote',
  eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  price: 1,
  totalSeats,
});

const cleanUpResource = async (
  api: EventHubApi,
  path: string,
): Promise<void> => {
  const response = await api.delete(path);
  if (response.status() !== 200 && response.status() !== 404) {
    throw new Error(`API cleanup failed for ${path} with HTTP ${response.status()}`);
  }
};

test.describe('EventHub API resource lifecycle', () => {
  test('creates, reads, and deletes an event through the API', async ({ request }) => {
    const api = await EventHubApi.authenticate(request);
    let eventId: number | undefined;
    let eventDeleted = false;

    try {
      const createResponse = await api.post(
        '/events',
        eventPayload(`Lifecycle event ${randomUUID()}`, 3),
      );
      expect(createResponse.status()).toBe(201);

      const created = (await createResponse.json()) as ApiEnvelope<EventRecord>;
      expect(created.success).toBe(true);
      eventId = created.data.id;
      expect(Number.isInteger(eventId)).toBe(true);

      const readResponse = await api.get(`/events/${eventId}`);
      expect(readResponse.status()).toBe(200);
      const read = (await readResponse.json()) as ApiEnvelope<EventRecord>;
      expect(read.success).toBe(true);
      expect(read.data.title).toBe(created.data.title);
      expect(read.data.category).toBe(created.data.category);

      const deleteResponse = await api.delete(`/events/${eventId}`);
      expect(deleteResponse.status()).toBe(200);
      eventDeleted = true;

      const postcondition = await api.get(`/events/${eventId}`);
      expect(postcondition.status()).toBe(404);
    } finally {
      if (eventId !== undefined && !eventDeleted) {
        await cleanUpResource(api, `/events/${eventId}`);
      }
    }
  });

  test('creates, reads, and deletes a booking through the API', async ({ request }) => {
    const api = await EventHubApi.authenticate(request);
    let eventId: number | undefined;
    let bookingId: number | undefined;
    let bookingDeleted = false;
    let eventDeleted = false;

    try {
      const eventResponse = await api.post(
        '/events',
        eventPayload(`Booking lifecycle ${randomUUID()}`, 3),
      );
      expect(eventResponse.status()).toBe(201);
      const event = (await eventResponse.json()) as ApiEnvelope<EventRecord>;
      eventId = event.data.id;
      expect(Number.isInteger(eventId)).toBe(true);

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

      const deleteResponse = await api.delete(`/bookings/${bookingId}`);
      expect(deleteResponse.status()).toBe(200);
      bookingDeleted = true;

      const bookingPostcondition = await api.get(`/bookings/${bookingId}`);
      expect(bookingPostcondition.status()).toBe(404);

      const eventDeleteResponse = await api.delete(`/events/${eventId}`);
      expect(eventDeleteResponse.status()).toBe(200);
      eventDeleted = true;

      const eventPostcondition = await api.get(`/events/${eventId}`);
      expect(eventPostcondition.status()).toBe(404);
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
