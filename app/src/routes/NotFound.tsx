import { EmptyState, Header } from '@ocr/ui/react';

export function NotFound() {
  return (
    <>
      <Header title="Not found" />
      <main className="max-w-xl mx-auto">
        <EmptyState
          title="We could not find that page"
          message="It may have moved. Head back to the start."
          action={{ label: 'Go to the start', href: '/' }}
          data-testid="not-found"
        />
      </main>
    </>
  );
}
