import { randomUUID } from 'node:crypto';
import { test, expect } from '@fixtures';
import { EventHubApi } from '@api/eventhub-api';

type ApiEnvelope<T> = { success: boolean; data: T };
type EventRecord = { id: number; title: string; category: string };

const eventPayload = (title: string, totalSeats: number) => ({
  title,
  category: 'Workshop',
  venue: 'Online',
  city: 'Remote',
  eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  price: 1,
  totalSeats,
});

const cleanUpResource = async (api: EventHubApi, path: string): Promise<void> => {
  const response = await api.delete(path);
  if (response.status() !== 200 && response.status() !== 404) {
    throw new Error(`API cleanup failed for ${path} with HTTP ${response.status()}`);
  }
};

test.describe('Events', () => {
  test('TC6: Create, read, and delete an event through the API', async ({ request }) => {
    const api = await EventHubApi.authenticate(request);
    let eventId: number | undefined;
    let eventDeleted = false;

    try {
      const created = await test.step('Create an isolated event', async () => {
        const response = await api.post('/events', eventPayload(`Lifecycle event ${randomUUID()}`, 3));
        expect(response.status()).toBe(201);
        const envelope = (await response.json()) as ApiEnvelope<EventRecord>;
        expect(envelope.success).toBe(true);
        eventId = envelope.data.id;
        expect(Number.isInteger(eventId)).toBe(true);
        return envelope.data;
      });

      await test.step('Read back the created event', async () => {
        const response = await api.get(`/events/${eventId}`);
        expect(response.status()).toBe(200);
        const envelope = (await response.json()) as ApiEnvelope<EventRecord>;
        expect(envelope.success).toBe(true);
        expect(envelope.data.title).toBe(created.title);
        expect(envelope.data.category).toBe(created.category);
      });

      await test.step('Delete the event and verify the postcondition', async () => {
        const response = await api.delete(`/events/${eventId}`);
        expect(response.status()).toBe(200);
        eventDeleted = true;
        const postcondition = await api.get(`/events/${eventId}`);
        expect(postcondition.status()).toBe(404);
      });
    } finally {
      if (eventId !== undefined && !eventDeleted) {
        await cleanUpResource(api, `/events/${eventId}`);
      }
    }
  });
});
