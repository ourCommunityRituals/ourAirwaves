# OurAirwaves (OA)

Deployment and white label layer for OurCommunityRituals.

---

## What this is

The self-serve front door for OurCommunityRituals. A business, sponsor or creator gets one account and
sets up how its pages look on ourSharedEvents and ourWKRP, inside fixed rails: posters, screens,
SharedReports and profiles. The standard look is free and generous; fees unlock more posters, more
kinds of configuration and higher SharedReport levels.

It is also where a full branded copy (own domain, own branding) starts, for clients who need one.

Design and decisions: OCR-docs `docs/proposals/PROPOSAL_ourAirwaves-self-serve.md` (decided 2026-11-26).

---

## Part of the OCR product line

| Code | Product | Relationship |
|------|---------|-------------|
| OSE | OurSharedEvents | OA sets a brand's looks and limits through the OSE API; a fork for full white label |
| OSM | OurSharedMagnets | OSM provides knowledge, OA provides deployment |
| OW | OurWKRP | OA sets a profile's or brand's looks and limits through the OW API |
| OSG | OurSharedGames | Game format deployable to new corridors |
| OSR | OurSharedRecords | Archive format deployable to new corridors |
| OSP | OurSharedPulse | Recognition system deployable to new corridors |
| OER | OurEventRings | Analytics configured per client deployment |

---

## Key documents

| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE.md | `CLAUDE.md` | Session protocol for AI-assisted work |
| SKILL.md | `SKILL.md` | Reusable skills for OA work |
| OCR_VISION.md | `OCR-docs/docs/OCR_VISION.md` | Org-level source of truth |
| Self-serve design | `OCR-docs/docs/proposals/PROPOSAL_ourAirwaves-self-serve.md` | OA's role, accounts, tiers, links |

---

*Part of OurCommunityRituals LLC*
*Owner: Matt*
