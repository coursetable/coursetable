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
        chunkFileNames(chunkInfo) {
          if (chunkInfo.facadeModuleId?.includes('gapi-script'))
            // Prevent emitting two index-abcd.js files, which messes with build
            // size calculation
            return 'assets/gapi-script-[hash:10].js';
          return 'assets/[name]-[hash:10].js';
        },
        entryFileNames: 'assets/[name]-[hash:10].js',
      },
    },
    cssCodeSplit: false,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
