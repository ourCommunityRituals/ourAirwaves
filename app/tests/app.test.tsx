import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { App } from '../src/App';
import { ACTIONS } from '../src/actions';

afterEach(cleanup);
const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('ourAirwaves app', () => {
  it.each(['/', '/plans', '/looks', '/account', '/missing'])('%s has exactly one h1', (path) => {
    at(path);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
  });

  it('home leads with the free offer and one call to action', () => {
    at('/');
    expect(screen.getByTestId('home-free').textContent).toContain('10 poster designs');
    expect(screen.getByTestId('home-cta').getAttribute('href')).toBe('/plans');
  });

  it('home lists every action, each pointing at a real screen', () => {
    at('/');
    for (const a of ACTIONS) {
      expect(screen.getByTestId(`action-${a.id}`).getAttribute('href')).toBe(a.route);
    }
  });

  it('every action route renders its own screen, not the not-found page', () => {
    for (const a of ACTIONS) {
      at(a.route);
      expect(screen.queryByTestId('not-found')).toBeNull();
      cleanup();
    }
  });

  it('links move inside the app without a reload', () => {
    at('/');
    fireEvent.click(screen.getByTestId('home-cta'));
    expect(screen.getByTestId('plans-header')).toBeTruthy();
  });

  it('plans switch between events, sponsors and named profiles', () => {
    at('/plans');
    expect(within(screen.getByTestId('tier-free')).getByText('Poster designs')).toBeTruthy();
    fireEvent.click(screen.getByTestId('corner-sponsor'));
    expect(screen.getByTestId('corner-sponsor').getAttribute('aria-pressed')).toBe('true');
    expect(within(screen.getByTestId('tier-free')).getByText('Standard sponsor card')).toBeTruthy();
    expect(within(screen.getByTestId('tier-premium')).getAllByText('No limit').length).toBeGreaterThan(0);
  });

  it('the bottom nav marks the current page', () => {
    at('/plans');
    const current = within(screen.getByTestId('bottom-nav')).getByRole('link', { current: 'page' });
    expect(current.getAttribute('href')).toBe('/plans');
  });
});
