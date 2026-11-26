// How much help a person wants, from "walk me through it" to "show me
// everything". It changes how much the screens show at once, never what is
// allowed: the rails are the same at every level. Kept on this device for now;
// it moves to the account once accounts exist.
import { createContext, useContext, useState, type ReactNode } from 'react';

export type HelpLevel = 'guided' | 'standard' | 'full';

export const HELP_LEVELS: { value: HelpLevel; label: string; hint: string }[] = [
  { value: 'guided', label: 'Guide me', hint: 'One step at a time, with a note before each.' },
  { value: 'standard', label: 'Standard', hint: 'Everything you can do, in plain words.' },
  { value: 'full', label: 'Full control', hint: 'All the detail, plus the rules as data for your own tools.' },
];

const KEY = 'oa.help';
const DEFAULT: HelpLevel = 'standard';

function isLevel(v: unknown): v is HelpLevel {
  return v === 'guided' || v === 'standard' || v === 'full';
}

function load(): HelpLevel {
  try {
    const v = window.localStorage.getItem(KEY);
    return isLevel(v) ? v : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

const Ctx = createContext<{ level: HelpLevel; setLevel: (l: HelpLevel) => void }>({
  level: DEFAULT,
  setLevel: () => {},
});

export function HelpProvider({ children, initial }: { children: ReactNode; initial?: HelpLevel }) {
  const [level, setState] = useState<HelpLevel>(() => initial ?? load());
  const setLevel = (l: HelpLevel) => {
    setState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      // Private windows can refuse storage; the choice still holds for this visit.
    }
  };
  return <Ctx.Provider value={{ level, setLevel }}>{children}</Ctx.Provider>;
}

export const useHelp = () => useContext(Ctx);
