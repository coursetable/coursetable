import * as Sentry from '@sentry/react';

export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = isDev
  ? 'https://localhost:3001'
  : import.meta.env.REACT_APP_API_ENDPOINT;

// /* testing posthog in development only */ const POSTHOG_TOKEN = 'KP78eJ-P-nRNQcVeL9pgBPGFt_KXOlCnT7ZwoJ9UDUo';
export const POSTHOG_OPTIONS = {
  api_host: 'https://hog.coursetable.com',
  capture_pageview: false,
};

export const POSTHOG_TOKEN =
  import.meta.env.VITE_POSTHOG_TOKEN ||
  Sentry.captureException('posthog token not set') /* always false */ ||
  'dummy';
