import { Button, Card, Header } from '@ocr/ui/react';
import { ACTIONS } from '../actions';
import { formatLimit, tier } from '../rails';
import { ON_ACCENT } from '../ui';

// First phone screen carries the key display: what you get free, and the one
// thing to do next. Everything else is one tap away.
export function Home() {
  const free = tier('free').event;
  return (
    <>
      <Header title="ourAirwaves" data-testid="home-header" />
      <main className="px-5 py-5 flex flex-col gap-4 max-w-xl mx-auto">
        <Card
          title="Your pages, your way"
          sub="Set how your posters, screens, reports and profile look on ourSharedEvents and ourWKRP."
          data-testid="home-hero"
        >
          <ul className="list-none p-0 m-0 mb-4 text-sm text-text-muted flex flex-col gap-1" data-testid="home-free">
            <li>Free: {formatLimit(free.poster_designs_per_brand as number)} poster designs</li>
            <li>Free: ready-made looks</li>
            <li>Free: your SharedReport page</li>
          </ul>
          <Button href="/plans" block className={ON_ACCENT} data-testid="home-cta">
            Compare plans
          </Button>
        </Card>
        <section aria-labelledby="home-actions-title" className="flex flex-col gap-3">
          <h2 id="home-actions-title" className="text-base font-semibold">
            What you can do here
          </h2>
          {ACTIONS.map((a) => (
            <a
              key={a.id}
              href={a.route}
              className="block min-h-tap no-underline text-text"
              data-testid={`action-${a.id}`}
            >
              <Card title={`${a.icon}  ${a.title}`} sub={a.summary}>
                {a.status === 'coming' && (
                  <span className="text-xs text-text-muted">On the way</span>
                )}
              </Card>
            </a>
          ))}
        </section>
      </main>
    </>
  );
}
