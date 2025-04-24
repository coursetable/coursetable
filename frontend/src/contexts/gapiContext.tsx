import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

type Store = {
  gapi: typeof globalThis.gapi | null;
};

const GapiContext = createContext<Store | undefined>(undefined);
GapiContext.displayName = 'GapiContext';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

export function GapiProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [gapi, setGapi] = useState<typeof globalThis.gapi | null>(null);

  // Load gapi script and client
  useEffect(() => {
    async function loadGapi() {
      const { loadGapiInsideDOM } = await import('gapi-script');
      const newGapi = await loadGapiInsideDOM();
      await new Promise((resolve) => {
        newGapi.load(GAPI_CLIENT_NAME, resolve);
      });
      await Promise.all([
        newGapi.client.init({
          apiKey: import.meta.env.VITE_DEV_GCAL_API_KEY,
          clientId: import.meta.env.VITE_DEV_GCAL_CLIENT_ID,
          scope: SCOPES,
        }),
        newGapi.client.load('calendar', 'v3'),
      ]);
      setGapi(newGapi);
    }
    void loadGapi();
  }, []);

  const store: Store = useMemo(() => ({ gapi }), [gapi]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_DEV_GCAL_CLIENT_ID}>
      <GapiContext.Provider value={store}>{children}</GapiContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useGapi = () => useContext(GapiContext)!;
