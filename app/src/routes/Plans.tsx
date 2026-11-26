import { useState } from 'react';
import { Card, Header } from '@ocr/ui/react';
import { ON_ACCENT } from '../ui';
import { CORNERS, type Corner, formatLimit, rails, words } from '../rails';

export function Plans() {
  const [corner, setCorner] = useState<Corner>('event');
  return (
    <>
      <Header title="Plans" data-testid="plans-header" />
      <main className="px-5 py-5 flex flex-col gap-4 max-w-xl mx-auto">
        <p className="text-sm text-text-muted">
          Free is generous on purpose. Paid plans add more posters, more ways to set your look and
          deeper SharedReports.
        </p>
        <div role="group" aria-label="Show plans for" className="flex gap-2 flex-wrap">
          {CORNERS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={corner === c.id}
              onClick={() => setCorner(c.id)}
              className={
                'min-h-tap px-4 rounded-pill border text-sm font-semibold ' +
                (corner === c.id
                  ? `bg-accent border-accent ${ON_ACCENT}`
                  : 'bg-surface text-text border-border')
              }
              data-testid={`corner-${c.id}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {rails.tiers.map((t) => (
          <Card key={t.id} title={t.name} data-testid={`tier-${t.id}`}>
            <dl className="text-sm flex flex-col gap-2">
              {Object.entries(t[corner]).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-text-muted">{words(k)}</dt>
                  <dd className="m-0">
                    {Array.isArray(v) ? v.map(words).join(', ') : formatLimit(v)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
        <Card title="Never a paid extra" sub="Every plan gets all of these, always." data-testid="never-gated">
          <ul className="list-none p-0 m-0 text-sm flex flex-col gap-1">
            {rails.never_tier_gated.map((id) => (
              <li key={id}>{words(id)}</li>
            ))}
          </ul>
        </Card>
      </main>
    </>
  );
}
