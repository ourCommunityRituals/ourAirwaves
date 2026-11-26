import { Button, Card, Header } from '@ocr/ui/react';
import { ACTIONS, nextStep, type AppAction } from '../actions';
import { useHelp } from '../help';
import { formatLimit, tier } from '../rails';
import { ON_ACCENT } from '../ui';

// First phone screen carries the key display: what you get free, and the one
// thing to do next. How much more it shows depends on the help level.
export function Home() {
  const { level } = useHelp();
  return (
    <>
      <Header title="ourAirwaves" data-testid="home-header" />
      <main className="px-5 py-5 flex flex-col gap-4 max-w-xl mx-auto" data-help={level}>
        {level === 'guided' ? <Guided /> : <Overview />}
        {level !== 'guided' && <ActionList full={level === 'full'} />}
        <a href="/account" className="text-sm text-text-muted" data-testid="change-help">
          Change how much help you get
        </a>
      </main>
    </>
  );
}

function Guided() {
  const step = nextStep();
  return (
    <Card title="Your next step" sub={step.guide} data-testid="guided-step">
      <Button href={step.route} block className={ON_ACCENT} data-testid="home-cta">
        {step.title}
      </Button>
    </Card>
  );
}

function Overview() {
  const free = tier('free').event;
  return (
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
  );
}

function ActionList({ full }: { full: boolean }) {
  return (
    <section aria-labelledby="home-actions-title" className="flex flex-col gap-3">
      <h2 id="home-actions-title" className="text-base font-semibold">
        What you can do here
      </h2>
      {ACTIONS.map((a) => (
        <ActionCard key={a.id} a={a} />
      ))}
      {full && (
        <Card
          title="For your own tools"
          sub="The same actions and rules this app uses, as data."
          data-testid="data-links"
        >
          <ul className="list-none p-0 m-0 text-sm flex flex-col gap-1">
            <li><a href="/api/actions" target="_blank" rel="noopener">Actions</a></li>
            <li><a href="/api/rails" target="_blank" rel="noopener">Plans and rules</a></li>
          </ul>
        </Card>
      )}
    </section>
  );
}

function ActionCard({ a }: { a: AppAction }) {
  return (
    <a href={a.route} className="block min-h-tap no-underline text-text" data-testid={`action-${a.id}`}>
      <Card title={`${a.icon}  ${a.title}`} sub={a.summary}>
        {a.status === 'coming' && <span className="text-xs text-text-muted">On the way</span>}
      </Card>
    </a>
  );
}
