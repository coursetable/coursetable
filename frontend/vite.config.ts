import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactSvgPlugin from 'vite-plugin-react-svg';
import basicSsl from '@vitejs/plugin-basic-ssl';
import createHtmlPlugin from 'vite-plugin-html';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    reactSvgPlugin(),
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
