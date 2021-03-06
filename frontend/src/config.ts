export const isDev = process.env.NODE_ENV === 'development';

export const API_ENDPOINT = isDev
  ? 'https://localhost:8000'
  : process.env.API_ENDPOINT;

// /* testing posthog in development only */ const POSTHOG_TOKEN = 'KP78eJ-P-nRNQcVeL9pgBPGFt_KXOlCnT7ZwoJ9UDUo';
export const POSTHOG_OPTIONS = {
  api_host: 'https://hog.coursetable.com',
  capture_pageview: false,
};

export const POSTHOG_TOKEN =
  process.env.REACT_APP_POSTHOG_TOKEN ||
  console.error('posthog token not set') /* always false */ ||
  'dummy';
