import { EmptyState, Header } from '@ocr/ui/react';

export function Looks() {
  return (
    <>
      <Header title="Looks" data-testid="looks-header" />
      <main className="max-w-xl mx-auto">
        <EmptyState
          icon="◧"
          title="Your look editor is on the way"
          message="Soon you will set how your posters, screens, reports and profile look, right here. Ready-made looks are free."
          action={{ label: 'Compare plans', href: '/plans' }}
          data-testid="looks-coming"
        />
      </main>
    </>
  );
}
