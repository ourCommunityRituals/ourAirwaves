#!/usr/bin/env node
// Speed budget: the JavaScript a phone downloads on first visit, gzipped.
// Fails the build when the shipped app grows past it, so "fast" stays a test.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 110;
const dir = join(dirname(fileURLToPath(import.meta.url)), '../dist/assets');
let total = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
  const kb = gzipSync(readFileSync(join(dir, f))).length / 1024;
  total += kb;
  console.log(`${f}: ${kb.toFixed(1)} KB gzipped`);
}
console.log(`total JS: ${total.toFixed(1)} KB gzipped (budget ${BUDGET_KB} KB)`);
if (total > BUDGET_KB) {
  console.error(`Over the speed budget by ${(total - BUDGET_KB).toFixed(1)} KB.`);
  process.exit(1);
}
