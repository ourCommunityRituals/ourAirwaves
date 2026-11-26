// Everything a person can do in ourAirwaves, in one typed list. The screens
// render from it, and the Worker serves it at /api/actions, so a helper (a
// person, a script or an AI assistant) can read what the app can do and where,
// without scraping pages. Add an action here first, then its screen.
//
// The same list drives every level of help (help.ts): guided mode walks a
// person through it one step at a time, in list order; full control shows all
// of it at once. An agent works from it through /api/actions.
export type ActionStatus = 'ready' | 'coming';

export interface AppAction {
  id: string;
  title: string; // names the outcome, in the house voice
  summary: string;
  route: string;
  status: ActionStatus;
  icon: string;
  guide: string; // what guided mode says before this step, in one sentence
}

export const ACTIONS: AppAction[] = [
  {
    id: 'compare_plans',
    title: 'Compare plans',
    summary: 'See what Free, Mid and Premium give events, sponsors and named profiles.',
    route: '/plans',
    status: 'ready',
    icon: '☰',
    guide: 'Start here: see what your plan gives you, then pick the one that fits.',
  },
  {
    id: 'set_look',
    title: 'Set your look',
    summary: 'Choose how your posters, screens, reports and profile look.',
    route: '/looks',
    // Waits on the ourSharedEvents and ourWKRP looks APIs (OSE-2233, OW-230).
    status: 'coming',
    icon: '◧',
    guide: 'Pick a ready-made look for your posters, screens and reports.',
  },
  {
    id: 'open_account',
    title: 'Open your account',
    summary: 'One account for your brands on both products.',
    route: '/account',
    // Waits on the account and sign-in step (OCR-233).
    status: 'coming',
    icon: '○',
    guide: 'Open one account for your brands on ourSharedEvents and ourWKRP.',
  },
];

export function action(id: string): AppAction {
  const a = ACTIONS.find((x) => x.id === id);
  if (!a) throw new Error(`unknown action ${id}`);
  return a;
}

/** Guided mode's next step: the first action in list order that is ready. */
export function nextStep(): AppAction {
  const a = ACTIONS.find((x) => x.status === 'ready');
  if (!a) throw new Error('no ready action');
  return a;
}
