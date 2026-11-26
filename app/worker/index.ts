// ourAirwaves Worker: serves the built React app (static assets, see
// wrangler.toml) and the app's own small API. It talks to no other product yet:
// calls to ourSharedEvents and ourWKRP (edges E11 to E14) arrive with their APIs.
import { serveCss } from '@ocr/ui/css';
import { ACTIONS } from '../src/actions';
import { rails } from '../src/rails';

export interface Env {
  ASSETS: Fetcher;
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export async function handle(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const { pathname } = url;

  if (pathname === '/ui.css') return serveCss();

  if (pathname.startsWith('/api/')) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);
    }
    switch (pathname) {
      case '/api/health':
        return json({ ok: true, value: { service: 'ourairwaves' } });
      case '/api/rails':
        return json({ ok: true, value: rails });
      case '/api/actions':
        return json({ ok: true, value: ACTIONS });
      default:
        return json({ ok: false, code: 'NOT_FOUND' }, 404);
    }
  }

  return env.ASSETS.fetch(req);
}

export default { fetch: handle } satisfies ExportedHandler<Env>;
