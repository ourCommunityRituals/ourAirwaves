# SKILL.md — OurWhiteList (OWL)

Skills for working in the OurWhiteList repo.

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
