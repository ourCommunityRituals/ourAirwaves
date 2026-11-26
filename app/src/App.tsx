import type { MouseEvent, ReactNode } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { BottomNav } from '@ocr/ui/react';
import { Home } from './routes/Home';
import { Plans } from './routes/Plans';
import { Looks } from './routes/Looks';
import { Account } from './routes/Account';
import { NotFound } from './routes/NotFound';

const NAV = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/looks', label: 'Looks', icon: '◧' },
  { href: '/plans', label: 'Plans', icon: '☰' },
  { href: '/account', label: 'Account', icon: '○' },
];

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/looks" element={<Looks />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}

// The hub's parts render plain <a href> links. The shell turns a click on any
// same-site link into an in-app move, so pages switch instantly with no reload.
function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  }

  return (
    <div onClick={onClick} className="min-h-screen bg-bg text-text pb-24">
      {children}
      <BottomNav
        items={NAV.map((n) => ({ ...n, active: n.href === pathname }))}
        data-testid="bottom-nav"
      />
    </div>
  );
}
