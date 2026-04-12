import { useEffect } from 'react';
import * as Sentry from '@sentry/react';

import { useStore } from '../store';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

/**
 * Loads the gapi script and Calendar client once, then stores the client on
 * the Zustand store. Must render under {@link GoogleOAuthProvider}.
 */
export function GapiLoader() {
  const setGapi = useStore((s) => s.setGapi);

  useEffect(() => {
    let cancelled = false;

    async function loadGapi() {
      try {
        const { loadGapiInsideDOM } = await import('gapi-script');
        const newGapi = await loadGapiInsideDOM();
        await new Promise<void>((resolve) => {
          newGapi.load(GAPI_CLIENT_NAME, () => {
            resolve();
          });
        });
        await Promise.all([
          newGapi.client.init({
            apiKey: import.meta.env.VITE_DEV_GCAL_API_KEY,
            clientId: import.meta.env.VITE_DEV_GCAL_CLIENT_ID,
            scope: SCOPES,
          }),
          newGapi.client.load('calendar', 'v3'),
        ]);
        if (!cancelled) setGapi(newGapi);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load Google API client:', err);
          Sentry.captureException(err);
          setGapi(null);
        }
      }
    }

    void loadGapi();
    return () => {
      cancelled = true;
    };
  }, [setGapi]);

  return null;
}
