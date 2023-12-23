/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { createHtmlPlugin } from 'vite-plugin-html';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactPlugin(),
    createHtmlPlugin({ inject: dotenv.config().parsed }),
    basicSsl(),
  ],
  build: {
    outDir: './build',
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
