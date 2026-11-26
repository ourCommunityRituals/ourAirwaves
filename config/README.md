# ourAirwaves config

Two kinds of file, both checked on every pull request (`.github/workflows/config-check.yml`).

| File | Who edits it | What it holds |
|------|--------------|---------------|
| `airwaves.config.yaml` | Matt, by pull request | The rails: environments, the two product APIs and their links (E11 to E14), what never crosses, account roles, the one skin format, the tiers and their limits for every corner of the Triangle, and what is never tier-gated |
| `brands/<brand_id>.yaml` | A solution engineer by hand, or the OA app | One brand: its corner, products, tier, members (opaque ids only) and chosen looks |
| `brands/<brand_id>.skin.md` | The same | The brand's looks in the one skin .md format. Each product reads its own blocks and refuses what breaks its rules |

Start a new brand by copying `brands/_template.yaml`.

## Check it

```bash
pip install pyyaml
python3 scripts/check-config.py                       # the rails
python3 scripts/check-config.py --brain ../OCR-docs/ocr-docs-brain   # and against the brain
python3 -m unittest discover -s scripts/tests          # the check's own born-red tests
```

## What the check holds

- Staging is on and uses `stg.` hosts; production stays off until Matt opens it.
- OA talks only to ourSharedEvents and ourWKRP, only over the edges E11 to E14, and sends only a brand id, an opaque actor id, a skin and limits. Tokens are named, never pasted.
- No person data in any file: no attendee, no email, no count of people. Members are `oa_actor_...` ids.
- Free is generous (never zero), and a higher tier never gives less than a lower one.
- Security, audit, isolation, retention, the under-5 floor, colours and contrast, the required parts of each surface, plain code titles and UEC colours are never a tier lever.
- A faith organization is always on Free. Anonymous attendees never get an account.
- A brand file never asks for more than its tier gives.

Source of every rule: OCR-docs `docs/proposals/PROPOSAL_ourAirwaves-self-serve.md` (decided 2026-11-26).
