import * as Sentry from '@sentry/node';

import { isDev, SENTRY_DSN, SENTRY_ENVIRONMENT } from './config.js';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.httpIntegration(),
    // Enable Express.js middleware tracing
    Sentry.expressIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.15, //  Capture 15% of the transactions
  enabled: !isDev,
  environment: SENTRY_ENVIRONMENT,
});
