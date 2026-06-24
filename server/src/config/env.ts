import 'dotenv/config';

interface Config {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: number;
  JWT_REFRESH_EXPIRES_IN: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_REDIRECT_URI: string;
  FRONTEND_URL: string;
  ALLOWED_ORIGINS: string[];
}

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but was not defined.`);
  }
  return value;
};

export const config: Config = {
  PORT: parseInt(getEnv('PORT'), 10),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: parseInt(getEnv('JWT_ACCESS_EXPIRES_IN'), 10),
  JWT_REFRESH_EXPIRES_IN: parseInt(getEnv('JWT_REFRESH_EXPIRES_IN'), 10),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: getEnv('GOOGLE_REDIRECT_URI'),
  GITHUB_CLIENT_ID: getEnv('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: getEnv('GITHUB_CLIENT_SECRET'),
  GITHUB_REDIRECT_URI: getEnv('GITHUB_REDIRECT_URI'),
  FRONTEND_URL: getEnv('FRONTEND_URL'),
  ALLOWED_ORIGINS: getEnv('ALLOWED_ORIGINS').split(','),
};
