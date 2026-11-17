import { env } from '@config/env';

export const users = {
  appUser: {
    email: env.EMAIL,
    password: env.PASSWORD,
  },
};