// The rails as the app sees them: generated from config/airwaves.config.yaml
// by `npm run rails`. Never edit src/generated/rails.json by hand.
import railsJson from './generated/rails.json';

export type Corner = 'event' | 'sponsor' | 'attendee_named';
export type Limit = number | null; // null = no limit

export interface Tier {
  id: string;
  name: string;
  event: Record<string, Limit | string[]>;
  sponsor: Record<string, Limit | string[]>;
  attendee_named: Record<string, Limit | string[]>;
}

export interface Rails {
  schema_version: string;
  products: { id: string; name: string; side: string; surfaces: string[] }[];
  tiers: Tier[];
  shared_report_levels: Record<string, string[]>;
  never_tier_gated: string[];
}

export const rails = railsJson as Rails;

export const CORNERS: { id: Corner; label: string }[] = [
  { id: 'event', label: 'Events' },
  { id: 'sponsor', label: 'Sponsors' },
  { id: 'attendee_named', label: 'Named profiles' },
];

// Plain words for every id the rails use. A missing entry falls back to the id
// with underscores as spaces, and a test fails so it gets a real label.
export const WORDS: Record<string, string> = {
  poster_designs_per_brand: 'Poster designs',
  own_looks_per_surface: 'Your own looks per surface',
  own_looks: 'Your own looks',
  shared_report_level: 'SharedReport level',
  brands_per_account: 'Brands',
  people_per_brand: 'People on each brand',
  events_with_own_look: 'Events with your own look',
  configuration: 'What you can set',
  standard_look: 'Standard look',
  ready_made_looks: 'Ready-made looks',
  custom_arrangements: 'Your own arrangements',
  look_per_event: 'A look for each event',
  one_file_both_products: 'One look file for both products',
  hand_edits_by_us: 'Hand edits by our team',
  standard_sponsor_card: 'Standard sponsor card',
  own_sponsor_looks: 'Your own sponsor looks',
  sponsor_looks_every_event: 'Your sponsor look on every event',
  own_branded_deployment: 'Your own branded site',
  shared_report_page: 'Report page',
  shared_report_pdf: 'PDF report',
  shared_report_interactive: 'Interactive report',
  sponsor_views: 'Sponsor views',
  map_visualization: 'Map',
  trend_detection: 'Trends',
  audience_migration: 'Where audiences move',
  venue_signals: 'Venue signals',
  corridor_forecasting: 'Corridor forecasts',
  security: 'Security',
  audit: 'Audit trail',
  isolation: 'Keeping your data separate',
  retention: 'Data retention rules',
  under_5_floor: 'Counts under 5 always hidden',
  colours_and_contrast: 'Readable colours and contrast',
  required_surface_parts: 'The required parts of every page',
  code_plain_titles: 'Plain titles on every code',
  uec_colours: 'Event colours on every code',
};

export function words(id: string): string {
  return WORDS[id] ?? id.replace(/_/g, ' ');
}

export function formatLimit(v: Limit): string {
  return v === null ? 'No limit' : String(v);
}

export function tier(id: string): Tier {
  const t = rails.tiers.find((x) => x.id === id);
  if (!t) throw new Error(`unknown tier ${id}`);
  return t;
}
