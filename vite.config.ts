import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Порт один для dev и preview.
 *
 * Раньше dev поднимался на 5000, и туннель, настроенный на 5500,
 * упирался в закрытый порт. Один номер в обоих режимах означает, что
 * адрес туннеля не нужно менять при переключении между `npm run dev` и
 * `npm run preview`.
 */
const PORT = 5500;

/**
 * Хосты, которым разрешено обращаться к серверу разработки.
 *
 * Vite проверяет заголовок Host и отклоняет незнакомые: это защита от
 * DNS rebinding, когда чужая страница обращается к твоему localhost.
 * Туннель приходит со своим доменом, поэтому без этого списка вместо
 * приложения отдавалось бы «Blocked request. This host is not
 * allowed».
 *
 * Точка в начале разрешает поддомены. Перечислены только домены
 * туннелей — открывать доступ всем (`true`) не нужно.
 */
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
    port: PORT,
    allowedHosts: TUNNEL_HOSTS,
  },
  preview: {
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
