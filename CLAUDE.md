# CLAUDE.md — OurAirwaves (OA)

> **Session protocol**: Read this file → Read OCR-docs `docs/proposals/PROPOSAL_ourAirwaves-self-serve.md` → Read OCR-docs `docs/OCR_VISION.md` → Execute the task.

---

## What this repo is

OurAirwaves is the **self-serve front door** of OurCommunityRituals (owner decision, 2026-11-26).
A business, sponsor or creator gets one account here and sets up how its pages look on
ourSharedEvents (OSE) and ourWKRP (OW), inside fixed rails. People expect to take control of their
own product without waiting; OCR provides the rails.

It is also where a full branded deployment (fork, own domain) starts, for the few clients who need one.

The design, and every decision behind it, is OCR-docs `docs/proposals/PROPOSAL_ourAirwaves-self-serve.md`
(decided 2026-11-26, D1 to D7). Read it before any work here.

The app shell is in `app/` (React and Vite with a Cloudflare Worker, PR 58, 26 Nov 2026) and the app's config is in `config/` (PR 55). It is not hosted yet and does not call ourSharedEvents or ourWKRP yet. The order of work is in section 8 of that proposal.

---

## Product identity

| Field | Value |
|-------|-------|
| Code | OA |
| Full name | OurAirwaves |
| Type | Self-serve account and configuration app; deployment and white label |
| Data model | Named accounts, brands, roles, tiers and limits. Never attendee data. |
| Dependencies | OSE and OW (their APIs), the hub design system, OSM (franchise knowledge) |
| Status | App shell on main (`app/`), not hosted yet; no API calls to OSE or OW yet |

---

## What OA owns

- The business account and sign-in for both products (D1): one account, one or more brands, roles owner / editor / viewer
- Each brand's tier, and the limits that tier gives (posters, kinds of configuration, SharedReport level)
- Writing looks and limits to OSE and OW through their APIs, and reading back what is set and how much of each limit is used
- The front door to the look editors, then its own editor on the same skin .md format (D2)
- Full branded deployments (fork, custom domain), the old Enterprise path

## What OA does NOT own

- The rules for a look. Each product parses and refuses a skin itself (OSE `lib/layout-skin-md.ts`, OW profile layout). OA never holds a rail, so it cannot loosen one.
- Any product database. OA never reads or writes OSE or OW tables directly.
- Attendee data of any kind: scans, check-ins, votes, registrations, sign-ups, or counts of people
- Platform application code (OSE), franchise knowledge (OSM), analytics (OER)

---

## Rails that never move

- **APIs, never shared databases.** OA calls OSE and OW over HTTP with a brand-scoped OA service token. No module imports across products (invariant #22 blocks `@ourairwaves/...`).
- **The anonymous side never learns who the OA user is.** OSE receives a brand id, the service token and an opaque OA actor id. Never a name or an email.
- **Anonymous attendees never have an OA account and never pay** (D7). Attendee tiers apply only to named profiles on OW.
- **Never tier-gated:** security, audit, isolation and retention; the under-5 floor ("Fewer than 5"); colours and contrast (design tokens); the required parts of each surface; plain titles and UEC colours on every code.
- **Each product enforces its own limits** (D6). With no word from OA, a product uses the Free limits: generous, never nothing.
- **One skin format.** The skin .md format is the only one. Layouts never carry across surfaces; only the abstraction does.

---

## Tiers (decided 2026-11-26, D3 to D5 and D7)

Free is generous on purpose, to get businesses running. Fees unlock more posters, more kinds of
configuration and higher SharedReport levels, for every corner of the Triangle. The numbers and the
sponsor and attendee rows are in section 6 of the proposal; `OCR-docs ocr-docs-brain/tier-gates.yaml`
holds the SharedReport features per tier.

---

## Links to other products

Every link that carries data, code or rules between OCR products is listed in OCR-docs `ocr-docs-brain/data-edges.yaml`. **A data link that is not listed there is not allowed.**

- **This repo's data links today:** E3, ourAirwaves to ourEventRings: deployment telemetry only (`contract_only`). E11 and E12, ourAirwaves to OSE and to OW: looks and tier limits. E13 and E14, OSE and OW back to ourAirwaves: current looks and limit use, never people. E11 to E14 are `decided`, not built.
- **Shared links every spoke has:** C1 (the hub's design system, pinned in `.ocr-hub-ref`) and G1 (the brain's rules and checks).
- **Before writing code that sends or reads another product's data:** add the link to `data-edges.yaml` in an OCR-docs PR first, with its privacy class and what enforces it. The field-level rules stay in OCR-docs `docs/architecture/OCR_ARCHITECTURE_oerAggregationBoundary.md`.

Product id in that file: `oaw`.

---

## DAC compliance

| File | Purpose | Status |
|------|---------|--------|
| CLAUDE.md | Session protocol | Present |
| README.md | Public-facing description | Present |
| SKILL.md | Reusable skills | Present |

Vision lives in OCR-docs `docs/OCR_VISION.md` only.

---

## CCR Protocol

All production-grade decisions follow the CCR (Critical, Conservative, Recursive) protocol. See `OCR-docs/skills/ccr-protocol.knowledge.md` for full spec. Also available locally at `.ocr-standards/skills/` after propagation.

---

## Open decisions

- Where the OA app is hosted and its domain
- Billing provider (no billing exists yet; paid limits are turned on by the platform until it does)
- Fork template design for full branded deployments

---

*Derived from OCR-docs/docs/OCR_VISION.md and the self-serve proposal*
*Last updated: November 26 2026 (self-serve front door, owner decision)*
*Owner: Matt*
*Status: ACTIVE*
