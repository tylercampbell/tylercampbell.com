import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.tylercampbell.com/',

  vite: {
    plugins: [tailwindcss()],
  },
});