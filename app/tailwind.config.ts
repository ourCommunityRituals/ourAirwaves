import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config } from 'tailwindcss';
import { ocrTailwindPreset } from '@ocr/ui/tailwind';

// The hub's React parts live in @ocr/ui (pinned in ../.ocr-hub-ref). Tailwind
// must see their class names, so their source is part of `content`.
const here = dirname(fileURLToPath(import.meta.url));

export default {
  presets: [ocrTailwindPreset as Config],
  content: [
    join(here, 'index.html'),
    join(here, 'src/**/*.{ts,tsx}'),
    join(here, 'node_modules/@ocr/ui/src/react/**/*.{ts,tsx}'),
  ],
  // /ui.css (the hub stylesheet) owns the base layer; Tailwind adds utilities only.
  corePlugins: { preflight: false },
} satisfies Config;
