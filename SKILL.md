# SKILL.md — OurAirwaves (OA)

Skills for working in the OurAirwaves repo.

---

## Skill: Self-Serve Change

### When to Use
User says: "self-serve", "account", "tier", "limits", "look editor", "skins", "front door"

### Steps
1. Read OCR-docs `docs/proposals/PROPOSAL_ourAirwaves-self-serve.md` (decided 2026-11-26).
2. If the change sends or reads OSE or OW data, check it fits E11 to E14 in OCR-docs `ocr-docs-brain/data-edges.yaml`. If it does not, add or change the edge in an OCR-docs PR first.
3. Call the product API; never a product database, never a module import.
4. Keep every rule in the product: OA shows the product's refusal message, it never re-checks a look itself.
5. Never send a name or email to OSE; never read attendee data or counts.
6. Check the never-tier-gated list in `CLAUDE.md` before adding any limit.

---

## Skill: Client Fork Setup

### When to Use
User says: "fork", "new client", "client setup", "deploy client"

### Steps
1. Read OCR-docs `docs/VISION.md` for white label context
2. Define client requirements: tier (Mid/Enterprise), custom domain, branding
3. Fork OSE into client workspace
4. Configure per-client environment: secrets, domain, feature flags, branding assets
5. Verify client data isolation
6. Document client setup in `clients/[client-name]/`

---

## Skill: Onboarding Runbook

### When to Use
User says: "onboarding", "runbook", "how to deploy", "new deployment"

### Steps
1. Read OCR-docs `docs/VISION.md` for deployment context
2. Read OSM `SKILL.md` for franchise knowledge
3. Define step-by-step deployment process:
   - Environment provisioning
   - Fork and configure
   - DNS and custom domain setup
   - Feature flag configuration per tier
   - Branding asset deployment
   - Smoke test and verification
4. Document in `docs/runbook/`

---

## Skill: Environment Schema

### When to Use
User says: "environment schema", "client config", "env setup", "configuration"

### Steps
1. Read OCR-docs `docs/VISION.md` for product registry
2. Read OSE `CLAUDE.md` for secrets and environment variables
3. Define per-client environment schema: required vars, optional vars, tier-dependent vars
4. Define secrets management per client
5. Document in `docs/schema/`

---

## Skill: Client Audit

### When to Use
User says: "client audit", "deployment check", "verify client"

### Steps
1. For a given client deployment, verify:
   - Environment configuration matches schema
   - Feature flags set correctly for tier
   - Custom domain resolving
   - Data isolation confirmed
   - Branding assets deployed
   - Health check passing
2. Report status and flag discrepancies
3. Document in `clients/[client-name]/audit/`

---

*Last updated: April 5 2026*
*Owner: Matt*
*Status: ACTIVE*
