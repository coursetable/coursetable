/// <reference types="vite/client" />
/// <reference types="gapi.auth2"/>
/// <reference types="gapi.calendar"/>

interface ImportMetaEnv extends Readonly<{ [key: string]: string }> {
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_CANNY_ID: string;
  readonly VITE_SENTRY_RELEASE: string;
  readonly VITE_DEV_GCAL_API_KEY: string;
  readonly VITE_DEV_GCAL_CLIENT_ID: string;
}
