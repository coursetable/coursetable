/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactPlugin(),
    createHtmlPlugin({ inject: dotenv.config().parsed }),
    basicSsl(),
    visualizer({
      filename: 'build/bundle-map.html',
    }),
  ],
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash:10][extname]',
        chunkFileNames: 'assets/[name]-[hash:10].js',
        entryFileNames: 'assets/[name]-[hash:10].js',
      },
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
