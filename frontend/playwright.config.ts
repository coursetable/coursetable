import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'x-vercel-skip-toolbar': '1',
    },
  },
});
