// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { handle, type Env } from '../worker';
import { ACTIONS } from '../src/actions';

const env: Env = {
  ASSETS: { fetch: async () => new Response('asset', { status: 200 }) } as unknown as Fetcher,
};
const get = (path: string, init?: RequestInit) => handle(new Request(`https://oa.test${path}`, init), env);

describe('ourAirwaves worker', () => {
  it('answers health', async () => {
    const res = await get('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, value: { service: 'ourairwaves' } });
  });

  it('serves the rails without secret names, routes or hosts', async () => {
    const body = await (await get('/api/rails')).text();
    expect(JSON.parse(body).value.tiers.map((t: { id: string }) => t.id)).toEqual(['free', 'mid', 'premium']);
    expect(body).not.toMatch(/TOKEN|token_secret|https?:\/\//);
  });

  it('lists every action an assistant can take', async () => {
    const body = (await (await get('/api/actions')).json()) as { value: unknown[] };
    expect(body.value).toEqual(ACTIONS);
  });

  it('refuses writes to the API', async () => {
    expect((await get('/api/rails', { method: 'POST', body: '{}' })).status).toBe(405);
  });

  it('answers unknown API paths with 404, not the app page', async () => {
    const res = await get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(/json/);
  });

  it('serves the hub stylesheet at /ui.css', async () => {
    const res = await get('/ui.css');
    expect(res.headers.get('content-type')).toMatch(/text\/css/);
    expect(await res.text()).toContain('--bg');
  });

  it('hands everything else to the static app', async () => {
    expect(await (await get('/plans')).text()).toBe('asset');
  });
});
