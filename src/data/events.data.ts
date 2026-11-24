import { randomUUID } from 'node:crypto';
import { env } from '@config/env';

export type EventPayload = {
  title: string;
  category: string;
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
};

export const buildEventPayload = (
  purpose: 'lifecycle' | 'booking',
  parallelIndex = 0,
): EventPayload => {
  const suffix = `${parallelIndex}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const title = `${env.testDataPrefix}${purpose}-${suffix}`;

  return {
    title,
    category: 'Workshop',
    venue: 'Online',
    city: 'Remote',
    eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    price: 1,
    totalSeats: 3,
  };
};
