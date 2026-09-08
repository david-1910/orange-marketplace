import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const PORT = 5500;

const HOST = '127.0.0.1';

const TUNNEL_HOSTS = [
  '.ngrok-free.app',
  '.ngrok-free.dev',
  '.ngrok.app',
  '.ngrok.io',
  '.trycloudflare.com',
  '.loca.lt',
];

export default defineConfig({
  server: {
    host: HOST,
    port: PORT,
    allowedHosts: TUNNEL_HOSTS,
  },
  preview: {
    host: HOST,
    port: PORT,
    allowedHosts: TUNNEL_HOSTS,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
