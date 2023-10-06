import basicSsl from '@vitejs/plugin-basic-ssl';
import reactRefresh from '@vitejs/plugin-react-refresh';
import dns from 'dns'
import dotenv from 'dotenv';
import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import reactSvgPlugin from 'vite-plugin-react-svg';

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    reactSvgPlugin(),
    createHtmlPlugin({inject: dotenv.config().parsed}),
    basicSsl(),
  ],
  build: {
    outDir: './build',
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
