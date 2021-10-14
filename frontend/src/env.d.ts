interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_POSTHOG_TOKEN: string;
  readonly REACT_APP_SENTRY_RELEASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
