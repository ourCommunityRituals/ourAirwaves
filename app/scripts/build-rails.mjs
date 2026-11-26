#!/usr/bin/env node
// Turn config/airwaves.config.yaml (the rails, edited by Matt by pull request)
// into the small JSON the app and its Worker read: tiers, SharedReport levels
// and what is never tier-gated. Secret names, routes and environments stay out.
//
//   node scripts/build-rails.mjs           write src/generated/rails.json
//   node scripts/build-rails.mjs --check   fail if that file is out of date
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '../../config/airwaves.config.yaml');
const OUT = join(here, '../src/generated/rails.json');

export function buildRails(cfg) {
  const corners = ['event', 'sponsor', 'attendee_named'];
  const tiers = Object.entries(cfg.tiers).map(([id, t]) => ({
    id,
    name: t.display_name,
    ...Object.fromEntries(corners.map((c) => [c, t[c]])),
  }));
  return {
    schema_version: cfg.schema_version,
    source: 'config/airwaves.config.yaml',
    products: Object.entries(cfg.products).map(([id, p]) => ({
      id,
      name: p.name,
      side: p.side,
      surfaces: p.surfaces,
    })),
    tiers,
    shared_report_levels: cfg.shared_report_levels,
    never_tier_gated: cfg.never_tier_gated,
  };
}

const json = JSON.stringify(buildRails(parse(readFileSync(SRC, 'utf8'))), null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== json) {
    console.error('src/generated/rails.json is out of date: run `npm run rails` and commit it.');
    process.exit(1);
  }
  console.log('rails.json matches config/airwaves.config.yaml');
} else {
  writeFileSync(OUT, json);
  console.log('wrote src/generated/rails.json');
}
