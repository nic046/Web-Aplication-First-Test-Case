import path from 'path';
import dotenv from 'dotenv';

const TEST_ENV = process.env.TEST_ENV ?? 'local';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${TEST_ENV}`) });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}. Check your .env file.`);
  }

  return value.trim();
};

export const env = {
  TEST_ENV,
  BASE_URL: getRequiredEnv('BASE_URL'),
  EMAIL: getRequiredEnv('EMAIL'),
  PASSWORD: getRequiredEnv('PASSWORD'),
  testDataPrefix: process.env.TEST_DATA_PREFIX ?? 'qa_',
  allowDestructiveCleanup: process.env.ALLOW_DESTRUCTIVE_CLEANUP === 'true',
};

export default env;
