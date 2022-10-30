import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactSvgPlugin from 'vite-plugin-react-svg';
import { createHtmlPlugin } from 'vite-plugin-html';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    reactSvgPlugin(),
    createHtmlPlugin({ inject: { data: dotenv.config().parsed } }),
  ],
  build: {
    outDir: './build',
  },
});
