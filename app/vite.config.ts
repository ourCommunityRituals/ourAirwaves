import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config';

// ourAirwaves carries no stylesheet of its own (ADR-008). Tailwind needs a CSS
// entry to emit the hub preset's utility classes, so it gets a virtual one: the
// three directives below, and nothing a spoke could use to fork the design.
const TAILWIND_ENTRY = 'virtual:ocr-utilities.css';
const RESOLVED = '\0' + TAILWIND_ENTRY;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ocr-utilities',
      resolveId: (id) => (id === TAILWIND_ENTRY ? RESOLVED : null),
      load: (id) =>
        id === RESOLVED ? '@tailwind components;\n@tailwind utilities;\n' : null,
    },
  ],
  css: { postcss: { plugins: [tailwindcss(tailwindConfig)] } },
  // The hub's React parts are linked source; make them share this app's React.
  resolve: { dedupe: ['react', 'react-dom'] },
  build: { outDir: 'dist', target: 'es2022', sourcemap: false },
  server: {
    // `npm run dev:worker` serves /api and /ui.css on 8787; Vite proxies to it.
    proxy: { '/api': 'http://127.0.0.1:8787', '/ui.css': 'http://127.0.0.1:8787' },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
