import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}. Check your .env file.`);
  }

  return value.trim();
};

export const env = {
  BASE_URL: getRequiredEnv('BASE_URL'),
  EMAIL: getRequiredEnv('EMAIL'),
  PASSWORD: getRequiredEnv('PASSWORD'),
};

export default env;
