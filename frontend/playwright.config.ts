import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: `https://${process.env.HEAD_REF!.replace(/[^\da-zA-Z-]+/gu, '-').slice(-25)}.preview.coursetable.com`,
    extraHTTPHeaders: {
      'x-vercel-skip-toolbar': '1',
    },
  },
});
