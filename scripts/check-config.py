#!/usr/bin/env python3
"""Check ourAirwaves' config against its rails.

Usage:
  python3 scripts/check-config.py [--config config/airwaves.config.yaml]
                                  [--brands config/brands]
                                  [--brain ../OCR-docs/ocr-docs-brain]

Exits 1 and prints one line per problem when anything breaks a rail. With
--brain, it also checks the config against the brain's data-edges.yaml and
tier-gates.yaml, which stay the authority.

The rails come from OCR-docs docs/proposals/PROPOSAL_ourAirwaves-self-serve.md
(decided 2026-11-26). Each check names the rule it holds.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

TIER_ORDER = ["free", "mid", "premium"]
CORNERS = ["event", "sponsor", "attendee_named"]
PRODUCT_EDGES = {"ose": ("E11", "E13"), "ow": ("E12", "E14")}
ALLOWED_SENDS = {"brand_id", "oa_actor_id", "skin_md", "limits"}
REQUIRED_NEVER_GATED = {
    "security", "audit", "isolation", "retention", "under_5_floor",
    "colours_and_contrast", "required_surface_parts", "code_plain_titles", "uec_colours",
}
REQUIRED_NEVER_CROSSES = {
    "attendee_name", "attendee_email", "scan", "check_in", "vote",
    "registration", "email_signup", "attendee_count",
}
# Limits that must be above zero on Free: generous, never nothing (D6).
FREE_FLOOR = {
    "event": ["poster_designs_per_brand", "brands_per_account", "people_per_brand", "shared_report_level"],
    "sponsor": ["shared_report_level"],
}
SECRET_NAME = re.compile(r"^[A-Z][A-Z0-9_]{2,}$")
# Strings that look like a credential value rather than a name.
SECRET_VALUE = re.compile(r"(Bearer\s+\S+|(?=[A-Za-z0-9+/_\-]*\d)[A-Za-z0-9+/_\-]{32,}={0,2})")
PERSON_KEYS = {"name", "email", "full_name", "first_name", "last_name", "phone", "attendee", "attendees"}
SKIN_KEYS = {"surface", "skin", "columns", "order", "wide"}
INF = float("inf")


def _num(v):
    return INF if v is None else v


def check_config(cfg: dict) -> list[str]:
    errs: list[str] = []
    for key in ["schema_version", "app", "environments", "products", "never_crosses",
                "accounts", "skins", "default_tier", "tiers", "shared_report_levels",
                "forced_tiers", "never_tier_gated"]:
        if key not in cfg:
            errs.append(f"missing top-level key: {key}")
    if errs:
        return errs

    if not re.fullmatch(r"\d+\.\d+\.\d+", str(cfg["schema_version"])):
        errs.append("schema_version must read like 1.0.0")

    # Environments: staging is the record; production stays closed.
    envs = cfg["environments"]
    stg = envs.get("staging") or {}
    if not stg.get("enabled"):
        errs.append("environments.staging must be enabled (staging is the environment of record)")
    for k in ("ose_base_url", "ow_base_url"):
        if not str(stg.get(k, "")).startswith("https://stg."):
            errs.append(f"environments.staging.{k} must be a https://stg. host")
    if (envs.get("production") or {}).get("enabled") is not False:
        errs.append("environments.production.enabled must be false: production is closed until the owner opens it")

    # Products: APIs only, the listed edges only, no person data.
    never = set(cfg["never_crosses"] or [])
    missing = REQUIRED_NEVER_CROSSES - never
    if missing:
        errs.append(f"never_crosses is missing: {', '.join(sorted(missing))}")
    for pid, p in (cfg["products"] or {}).items():
        if pid not in PRODUCT_EDGES:
            errs.append(f"products.{pid}: OA may only talk to ose and ow (E11 to E14)")
            continue
        w, r = PRODUCT_EDGES[pid]
        if p.get("writes_edge") != w or p.get("reads_edge") != r:
            errs.append(f"products.{pid}: edges must be writes {w}, reads {r}")
        if not SECRET_NAME.fullmatch(str(p.get("token_secret", ""))):
            errs.append(f"products.{pid}.token_secret must be a secret NAME like OA_SERVICE_TOKEN_X, never a value")
        sends = set(p.get("sends") or [])
        if sends & never:
            errs.append(f"products.{pid}.sends names data that never crosses: {', '.join(sorted(sends & never))}")
        if sends - ALLOWED_SENDS:
            errs.append(f"products.{pid}.sends has fields outside E11/E12: {', '.join(sorted(sends - ALLOWED_SENDS))}")
        for route in p.get("routes") or []:
            path = str(route.get("path", ""))
            if not path.startswith("/") or "://" in path:
                errs.append(f"products.{pid}: route {path!r} must be a path on the product's own API")
        if not p.get("surfaces"):
            errs.append(f"products.{pid}.surfaces must name at least one surface")

    acc = cfg["accounts"] or {}
    if acc.get("anonymous_attendees_have_accounts") is not False:
        errs.append("accounts.anonymous_attendees_have_accounts must be false (D7)")
    if set((acc.get("roles") or {}).keys()) != {"owner", "editor", "viewer"}:
        errs.append("accounts.roles must be exactly owner, editor, viewer")

    sk = cfg["skins"] or {}
    if sk.get("format") != "skin_md":
        errs.append("skins.format must be skin_md: one format, no other")
    if sk.get("layouts_shared_across_surfaces") is not False:
        errs.append("skins.layouts_shared_across_surfaces must be false: surfaces never share a layout")

    if cfg["default_tier"] != "free":
        errs.append("default_tier must be free: with no word from OA a product uses Free (D6)")
    if (cfg["forced_tiers"] or {}).get("faith_organization") != "free":
        errs.append("forced_tiers.faith_organization must be free (tier-gates platform_commitments)")

    gated = set(cfg["never_tier_gated"] or [])
    missing = REQUIRED_NEVER_GATED - gated
    if missing:
        errs.append(f"never_tier_gated is missing: {', '.join(sorted(missing))}")

    errs += _check_tiers(cfg["tiers"] or {}, gated, cfg["shared_report_levels"] or {})
    _scan_for_secret_values(cfg, "config", errs)
    return errs


def _check_tiers(tiers: dict, gated: set, levels: dict) -> list[str]:
    errs: list[str] = []
    if list(tiers.keys()) != TIER_ORDER:
        return [f"tiers must be exactly {', '.join(TIER_ORDER)}, in that order"]
    if sorted(int(k) for k in levels) != [1, 2, 3]:
        errs.append("shared_report_levels must define levels 1, 2 and 3")
    for t, tier in tiers.items():
        for corner in CORNERS:
            c = tier.get(corner)
            if not isinstance(c, dict):
                errs.append(f"tiers.{t}.{corner} is missing")
                continue
            for k, v in c.items():
                if k in gated:
                    errs.append(f"tiers.{t}.{corner}.{k}: {k} is never tier-gated")
                if k == "configuration":
                    bad = set(v or []) & gated
                    if bad:
                        errs.append(f"tiers.{t}.{corner}.configuration gates {', '.join(sorted(bad))}, which is never tier-gated")
                elif v is not None and not (isinstance(v, int) and v >= 0):
                    errs.append(f"tiers.{t}.{corner}.{k} must be a whole number or null (no set limit)")
            lvl = c.get("shared_report_level")
            if lvl is not None and lvl not in (1, 2, 3):
                errs.append(f"tiers.{t}.{corner}.shared_report_level must be 1, 2 or 3")
    if errs:
        return errs
    # Free is generous: never nothing.
    for corner, keys in FREE_FLOOR.items():
        for k in keys:
            v = tiers["free"][corner].get(k)
            if v is not None and v < 1:
                errs.append(f"tiers.free.{corner}.{k} must be at least 1: Free is generous, never nothing")
    # A higher tier never gives less.
    for lo, hi in zip(TIER_ORDER, TIER_ORDER[1:]):
        for corner in CORNERS:
            a, b = tiers[lo][corner], tiers[hi][corner]
            if set(a) != set(b):
                errs.append(f"tiers.{lo}.{corner} and tiers.{hi}.{corner} must have the same levers")
                continue
            for k in a:
                if k == "configuration":
                    if not set(a[k] or []) <= set(b[k] or []):
                        errs.append(f"tiers.{hi}.{corner}.configuration must include everything in {lo}")
                elif _num(b[k]) < _num(a[k]):
                    errs.append(f"tiers.{hi}.{corner}.{k} gives less than {lo}")
    return errs


def _scan_for_secret_values(node, where: str, errs: list[str]) -> None:
    if isinstance(node, dict):
        for k, v in node.items():
            _scan_for_secret_values(v, f"{where}.{k}", errs)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            _scan_for_secret_values(v, f"{where}[{i}]", errs)
    elif isinstance(node, str) and SECRET_VALUE.search(node) and not node.startswith(("http", "/")):
        if not SECRET_NAME.fullmatch(node):
            errs.append(f"{where} looks like a credential value; name the secret, never paste it")


def _keys(node) -> set[str]:
    out: set[str] = set()
    if isinstance(node, dict):
        for k, v in node.items():
            out.add(str(k))
            out |= _keys(v)
    elif isinstance(node, list):
        for v in node:
            out |= _keys(v)
    return out


def check_brand(brand: dict, cfg: dict, folder: Path | None, label: str) -> list[str]:
    errs: list[str] = []
    p = f"brand {label}"
    bid = str(brand.get("brand_id", ""))
    if not re.fullmatch(r"[a-z0-9_]{2,64}", bid):
        errs.append(f"{p}: brand_id must be lower-case letters, digits and _")
    corner = brand.get("corner")
    if corner not in CORNERS:
        errs.append(f"{p}: corner must be one of {', '.join(CORNERS)}")
    products = brand.get("products") or []
    if not products or not set(products) <= set(cfg["products"]):
        errs.append(f"{p}: products must be ose, ow or both")
    if corner == "attendee_named" and "ose" in products:
        errs.append(f"{p}: an attendee account lives on the named side only (ow); anonymous attendees have none (D7)")
    tier = brand.get("tier")
    if tier not in cfg["tiers"]:
        errs.append(f"{p}: tier must be one of {', '.join(cfg['tiers'])}")
        return errs
    if brand.get("sponsor_type") == "faith_organization" and tier != cfg["forced_tiers"]["faith_organization"]:
        errs.append(f"{p}: a faith organization is always on the free tier")

    leaked = _keys(brand) & (PERSON_KEYS | set(cfg["never_crosses"]))
    if leaked:
        errs.append(f"{p}: holds person data ({', '.join(sorted(leaked))}); use opaque OA actor ids only")
    roles = set(cfg["accounts"]["roles"])
    members = brand.get("members") or []
    if not any(m.get("role") == "owner" for m in members):
        errs.append(f"{p}: needs one owner")
    for m in members:
        if not re.fullmatch(r"oa_actor_[a-z0-9]+", str(m.get("actor", ""))):
            errs.append(f"{p}: member {m.get('actor')!r} must be an opaque id like oa_actor_0001")
        if m.get("role") not in roles:
            errs.append(f"{p}: member role {m.get('role')!r} is not owner, editor or viewer")

    if corner in CORNERS:
        allowance = cfg["tiers"][tier][corner]
        cap = allowance.get("people_per_brand")
        if cap is not None and len(members) > cap:
            errs.append(f"{p}: {len(members)} people, but {tier} allows {cap} per brand")
        chosen = set((brand.get("looks") or {}).get("configuration") or [])
        extra = chosen - set(allowance.get("configuration") or [])
        if extra:
            errs.append(f"{p}: {tier} does not include {', '.join(sorted(extra))}")

    skin_file = (brand.get("looks") or {}).get("skin_file")
    if skin_file and folder is not None:
        errs += check_skin(folder / skin_file, cfg, products, p)
    _scan_for_secret_values(brand, p, errs)
    return errs


def check_skin(path: Path, cfg: dict, products: list, p: str) -> list[str]:
    """A light read of the skin .md: the products hold the real rules."""
    if not path.is_file():
        return [f"{p}: skin file {path.name} not found"]
    raw = path.read_bytes()
    errs: list[str] = []
    if len(raw) > cfg["skins"]["max_bytes"]:
        errs.append(f"{p}: {path.name} is over {cfg['skins']['max_bytes']} bytes")
    known = set()
    for pid in products:
        known |= set(cfg["products"].get(pid, {}).get("surfaces") or [])
    lines = raw.decode("utf-8").splitlines()
    i, seen = 0, set()
    while i < len(lines):
        nxt = next((l for l in lines[i + 1:] if l.strip()), "")
        if lines[i].strip() == "---" and re.match(r"\s*surface\s*:", nxt):
            j = i + 1
            while j < len(lines) and lines[j].strip() != "---":
                m = re.match(r"\s*([A-Za-z_]+)\s*:(.*)$", lines[j])
                if m and m.group(1) not in SKIN_KEYS:
                    errs.append(f"{p}: {path.name} line {j + 1}: {m.group(1)} is not a skin key")
                if m and m.group(1) == "surface":
                    s = m.group(2).strip()
                    if s in seen:
                        errs.append(f"{p}: {path.name} names surface {s} twice")
                    seen.add(s)
                j += 1
            i = j + 1
        else:
            i += 1
    if not seen & known:
        errs.append(f"{p}: {path.name} has no block for this brand's surfaces ({', '.join(sorted(known))})")
    return errs


def check_against_brain(cfg: dict, brain: Path) -> list[str]:
    errs: list[str] = []
    edges = yaml.safe_load((brain / "data-edges.yaml").read_text())
    by_id = {e["id"]: e for e in edges.get("edges", [])}
    for pid, (w, r) in PRODUCT_EDGES.items():
        target = "ose" if pid == "ose" else "wkrp"
        for eid, frm, to in ((w, "oaw", target), (r, target, "oaw")):
            e = by_id.get(eid)
            if not e:
                errs.append(f"brain: edge {eid} is not in data-edges.yaml")
            elif e.get("from") != frm or e.get("to") != to or e.get("status") == "retired" or e.get("retired"):
                errs.append(f"brain: edge {eid} is not {frm} -> {to}, or is retired")
    gates = yaml.safe_load((brain / "tier-gates.yaml").read_text())["tiers"]
    for t in TIER_ORDER:
        lvl = cfg["tiers"][t]["event"]["shared_report_level"]
        want = set(cfg["shared_report_levels"][lvl])
        feats = gates.get(t, {}).get("features", {})
        for f in want:
            if f not in feats:
                errs.append(f"brain: {f} is not a feature in tier-gates.yaml")
            elif feats[f] is not True:
                errs.append(f"brain: tiers.{t} gives SharedReport level {lvl}, but tier-gates.yaml has {f} off for {t}")
    return errs


def main(argv=None) -> int:
    here = Path(__file__).resolve().parent.parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default=str(here / "config/airwaves.config.yaml"))
    ap.add_argument("--brands", default=str(here / "config/brands"))
    ap.add_argument("--brain", default=None)
    a = ap.parse_args(argv)

    cfg = yaml.safe_load(Path(a.config).read_text())
    errs = check_config(cfg)
    if not errs:
        for f in sorted(Path(a.brands).glob("*.yaml")):
            errs += check_brand(yaml.safe_load(f.read_text()) or {}, cfg, f.parent, f.name)
        if a.brain:
            errs += check_against_brain(cfg, Path(a.brain))
    for e in errs:
        print(f"::error::{e}")
    if errs:
        print(f"{len(errs)} problem(s) in the ourAirwaves config")
        return 1
    print("ourAirwaves config: every rail holds")
    return 0


if __name__ == "__main__":
    sys.exit(main())
