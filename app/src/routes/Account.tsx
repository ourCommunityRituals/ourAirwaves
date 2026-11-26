import { EmptyState, Header } from '@ocr/ui/react';

export function Account() {
  return (
    <>
      <Header title="Account" data-testid="account-header" />
      <main className="max-w-xl mx-auto">
        <EmptyState
          icon="○"
          title="Accounts open soon"
          message="One account will cover your brands on ourSharedEvents and ourWKRP. People who just attend events never need one."
          action={{ label: 'Compare plans', href: '/plans' }}
          data-testid="account-coming"
        />
      </main>
    </>
  );
}
