# ourAirwaves app

The self-serve front door, built in React. One Cloudflare Worker serves the built
pages and the app's own `/api`. Design and decisions: OCR-docs
`docs/proposals/PROPOSAL_ourAirwaves-self-serve.md`.

## Stack

| Part | Choice | Why |
|------|--------|-----|
| Pages | React 19, React Router 7, TypeScript | Fast, typed, easy to change one screen at a time |
| Build | Vite 7 | Quick builds; output is plain static files |
| Host | One Cloudflare Worker with static assets | Same platform as ourSharedEvents and ourWKRP |
| Look | `@ocr/ui/react` parts + the hub Tailwind preset + `/ui.css` | One base brand; no stylesheet of our own |
| Node | 22 | `.nvmrc` |

## How it fits together

- `../config/airwaves.config.yaml` is the rails. `npm run rails` turns the parts the app
  shows (tiers, SharedReport levels, what is never tier-gated) into `src/generated/rails.json`.
  CI fails if that file is stale. Secret names, routes and hosts never reach it.
- `src/actions.ts` lists everything a person can do here. Screens render from it and the
  Worker serves it at `GET /api/actions`, so a helper or an assistant can see what the app
  can do without reading pages. Add the action first, then its screen.
- `src/help.tsx` sets how much help a person gets: Guide me (one step at a time, in the
  order of the action list), Standard, or Full control (all detail, plus the actions and
  rules as data). It changes what the screens show, never what is allowed. It is kept on
  the device until accounts exist.
- `worker/index.ts` serves `/api/health`, `/api/rails`, `/api/actions` and `/ui.css`, and
  hands every other path to the built app.
- `public/_headers` sets the response headers for every page.
- Speed budget: `npm run budget` fails when first-visit JavaScript passes 110 KB gzipped.

## Run it

The hub's `packages/ui` must sit at `../../packages/ui` (CI stages it with
`scripts/ci/stage-ocr-ui.sh` at the commit in `.ocr-hub-ref`).

```bash
npm ci
npm run ci          # rails check, types, tests, build, speed budget
npm run build && npm run dev:worker   # the whole app on http://localhost:8787
```

Nothing deploys yet: hosting and domain are open decisions (see `../CLAUDE.md`).
