import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script';

type Store = {
  gapi: typeof globalThis.gapi | null;
  authInstance: gapi.auth2.GoogleAuthBase | null;
  user: gapi.auth2.GoogleUser | null;
  setUser: React.Dispatch<React.SetStateAction<gapi.auth2.GoogleUser | null>>;
};

const GapiContext = createContext<Store | undefined>(undefined);
GapiContext.displayName = 'GapiContext';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

export function GapiProvider({ children }: { readonly children: React.ReactNode }) {
  const [gapi, setGapi] = useState<typeof globalThis.gapi | null>(null);
  const [authInstance, setAuthInstance] =
    useState<gapi.auth2.GoogleAuthBase | null>(null);
  const [user, setUser] = useState<gapi.auth2.GoogleUser | null>(null);

  // Load gapi script and client
  useEffect(() => {
    async function loadGapi() {
      const newGapi = await loadGapiInsideDOM();
      await new Promise((resolve) => newGapi.load(GAPI_CLIENT_NAME, resolve));
      const [, , newAuth2] = await Promise.all([
        newGapi.client.init({
          apiKey: import.meta.env.VITE_DEV_GCAL_API_KEY,
          clientId: import.meta.env.VITE_DEV_GCAL_CLIENT_ID,
          scope: SCOPES,
        }),
        newGapi.client.load('calendar', 'v3'),
        loadAuth2(newGapi, import.meta.env.VITE_DEV_GCAL_CLIENT_ID, SCOPES),
      ]);
      setGapi(newGapi);
      setAuthInstance(newAuth2);
      if (newAuth2.isSignedIn.get()) 
        setUser(newAuth2.currentUser.get());
      
    }
    loadGapi();
  }, []);

  const store: Store = useMemo(
    () => ({ gapi, authInstance, user, setUser }),
    [gapi, authInstance, user],
  );

  return <GapiContext.Provider value={store}>{children}</GapiContext.Provider>;
}

export const useGapi = () => useContext(GapiContext)!;
