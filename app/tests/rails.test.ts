// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { rails, WORDS, tier } from '../src/rails';

describe('rails in the app', () => {
  it('Free is generous: never zero poster designs, always the report page', () => {
    const free = tier('free').event;
    expect(free.poster_designs_per_brand).toBeGreaterThan(0);
    expect(free.shared_report_level).toBeGreaterThanOrEqual(1);
  });

  it('every id shown on screen has plain words', () => {
    const ids = new Set<string>(rails.never_tier_gated);
    for (const t of rails.tiers) {
      for (const corner of [t.event, t.sponsor, t.attendee_named]) {
        for (const [k, v] of Object.entries(corner)) {
          ids.add(k);
          if (Array.isArray(v)) v.forEach((x) => ids.add(x));
        }
      }
    }
    const missing = [...ids].filter((id) => !(id in WORDS));
    expect(missing).toEqual([]);
  });
});
