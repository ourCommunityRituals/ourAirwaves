import { Card, EmptyState, Header, RadioGroup } from '@ocr/ui/react';
import { HELP_LEVELS, useHelp, type HelpLevel } from '../help';

export function Account() {
  const { level, setLevel } = useHelp();
  return (
    <>
      <Header title="Account" data-testid="account-header" />
      <main className="px-5 py-5 flex flex-col gap-4 max-w-xl mx-auto">
        <Card title="How much help do you want?" sub="Change it any time. Every level can do the same things." data-testid="help-choice">
          <RadioGroup
            name="help"
            legend="Help level"
            options={HELP_LEVELS.map((h) => ({
              value: h.value,
              label: `${h.label}: ${h.hint}`,
              checked: h.value === level,
            }))}
            onChange={(e) => setLevel(e.target.value as HelpLevel)}
            data-testid="help-level"
          />
        </Card>
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
