# CLAUDE.md — OurWhiteList (OWL)

> **Session protocol**: Read this file → Read OCR-docs `docs/VISION.md` → Understand OWL's role in the OCR product line → Execute the task.

---

## What this repo is

OurWhiteList is the deployment and white label layer for OurCommunityRituals. Client workspace fork template. Onboarding runbook. Per-client environment schema.

When a new corridor or client needs their own instance of the OCR platform, OWL is how it gets deployed.

This repo is currently documentation-as-code. Deployment templates and runbooks will be added as the white label model is defined.

---

## Product identity

| Field | Value |
|-------|-------|
| Code | OWL |
| Full name | OurWhiteList |
| Type | Deployment and white label |
| Data model | Client environment schemas, fork templates |
| Dependencies | OSE (platform source), OSM (franchise knowledge) |
| Status | Documentation-as-code |

---

## What OWL owns

- Client workspace fork template
- Onboarding runbook for new deployments
- Per-client environment schema and configuration
- White label deployment process
- Client isolation and data separation
- Environment provisioning (staging, production per client)

## What OWL does NOT own

- Platform application code (OSE)
- Franchise knowledge and documentation (OSM)
- Game night format (OSG)
- Music curation (OW)
- Consulting relationships (OSP)
- Analytics and intelligence (OER)

---

## Key distinction

OWL deploys. OSM documents. OWL sets up the client environment, provisions infrastructure, and manages the fork. OSM provides the knowledge of what to do once it's running.

---

## White label tiers (from OW/OSE)

| Tier | Scope | OWL responsibility |
|------|-------|-------------------|
| Free | Default global flags | No OWL involvement — standard platform |
| Mid | Global overrides, self-serve config | Client environment setup, config management |
| Enterprise | Event-level overrides, full control | Full fork, custom domain, branded deployment |

---

## Architectural boundaries

- **OSE is the source.** OWL forks and deploys OSE, does not modify the core platform.
- **Client data isolation is non-negotiable.** Each client deployment has its own data boundary.
- **OSM provides the runbook content.** OWL executes the deployment; OSM provides the operational knowledge.
- **White label branding lives at the deployment layer.** Custom domains, colors, logos — OWL manages these per client.

---

## DAC compliance

| File | Purpose | Status |
|------|---------|--------|
| CLAUDE.md | Session protocol | Present |
| README.md | Public-facing description | Present |
| SKILL.md | Reusable skills | Present |

Vision lives in OCR-docs `docs/VISION.md` only.

---

## CCR Protocol

All production-grade decisions follow the CCR (Critical, Conservative, Recursive) protocol. See `ourSharedEvents/.claude/skills/ccr-protocol.knowledge.md` for full spec.

---

## Open decisions

- OWL repo structure and client fork workflow
- Fork template design (monorepo fork vs selective deployment)
- Per-client environment schema definition
- Client onboarding automation level

---

*Derived from OCR-docs/docs/VISION.md*
*Last updated: April 5 2026*
*Owner: Matt*
*Status: ACTIVE*
