import { defineConfig } from '@playwright/test';

console.log('BASE_URL:', process.env.BASE_URL);

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'x-vercel-skip-toolbar': '1',
    },
  },
});
