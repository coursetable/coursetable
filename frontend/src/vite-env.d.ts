/// <reference types="vite/client" />
/// <reference types="gapi.auth2"/>
/// <reference types="gapi.calendar"/>

interface ImportMetaEnv extends Readonly<{ [key: string]: string }> {
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_CANNY_ID: string;
  readonly VITE_SENTRY_RELEASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
