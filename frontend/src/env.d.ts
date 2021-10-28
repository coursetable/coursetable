interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_POSTHOG_TOKEN: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_CANNY_ID: string;
  readonly VITE_UMAMI_WEBSITE_ID: string;
  readonly VITE_SENTRY_RELEASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
