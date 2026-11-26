"""Born-red tests for scripts/check-config.py.

Each test injects one fault into a copy of the real config (or a brand file)
and asserts the check catches it. A gate that cannot fail counts as absent.
Run: python3 -m unittest discover -s scripts/tests
"""
import copy
import importlib.util
import tempfile
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("check_config", ROOT / "scripts/check-config.py")
cc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cc)

CFG = yaml.safe_load((ROOT / "config/airwaves.config.yaml").read_text())
BRANDS = ROOT / "config/brands"
BRAND = yaml.safe_load((BRANDS / "_template.yaml").read_text())


class Config(unittest.TestCase):
    def errs(self, mutate):
        cfg = copy.deepcopy(CFG)
        mutate(cfg)
        return cc.check_config(cfg)

    def assertCaught(self, mutate, words):
        errs = self.errs(mutate)
        self.assertTrue(any(words in e for e in errs), f"expected {words!r} in {errs}")

    def test_real_config_passes(self):
        self.assertEqual(cc.check_config(copy.deepcopy(CFG)), [])

    def test_production_open_is_refused(self):
        self.assertCaught(lambda c: c["environments"]["production"].update(enabled=True), "production is closed")

    def test_staging_must_be_stg_host(self):
        self.assertCaught(lambda c: c["environments"]["staging"].update(ose_base_url="https://oursharedevents.com"), "https://stg.")

    def test_token_value_instead_of_name(self):
        self.assertCaught(lambda c: c["products"]["ose"].update(token_secret="fake9f8e7d6c5b4a39281706f5e4d3c2b1a0fake"), "secret NAME")

    def test_wrong_edge(self):
        self.assertCaught(lambda c: c["products"]["ow"].update(writes_edge="E11"), "edges must be")

    def test_unknown_product(self):
        self.assertCaught(lambda c: c["products"].update(oer={"writes_edge": "E3"}), "only talk to ose and ow")

    def test_sending_person_data(self):
        self.assertCaught(lambda c: c["products"]["ose"]["sends"].append("attendee_email"), "never crosses")

    def test_sending_unlisted_field(self):
        self.assertCaught(lambda c: c["products"]["ose"]["sends"].append("venue_wifi"), "outside E11/E12")

    def test_route_to_other_host(self):
        self.assertCaught(lambda c: c["products"]["ose"]["routes"].append({"path": "https://evil.example/x"}), "own API")

    def test_dropping_a_never_crosses_item(self):
        self.assertCaught(lambda c: c["never_crosses"].remove("vote"), "never_crosses is missing")

    def test_anonymous_attendee_accounts(self):
        self.assertCaught(lambda c: c["accounts"].update(anonymous_attendees_have_accounts=True), "D7")

    def test_second_skin_format(self):
        self.assertCaught(lambda c: c["skins"].update(format="json"), "one format")

    def test_shared_layouts(self):
        self.assertCaught(lambda c: c["skins"].update(layouts_shared_across_surfaces=True), "never share")

    def test_default_tier_not_free(self):
        self.assertCaught(lambda c: c.update(default_tier="mid"), "D6")

    def test_faith_not_free(self):
        self.assertCaught(lambda c: c["forced_tiers"].update(faith_organization="mid"), "faith_organization")

    def test_dropping_never_gated_item(self):
        self.assertCaught(lambda c: c["never_tier_gated"].remove("under_5_floor"), "never_tier_gated is missing")

    def test_gating_a_never_gated_item(self):
        self.assertCaught(lambda c: c["tiers"]["premium"]["event"]["configuration"].append("uec_colours"), "never tier-gated")

    def test_free_gives_nothing(self):
        self.assertCaught(lambda c: c["tiers"]["free"]["event"].update(poster_designs_per_brand=0), "never nothing")

    def test_higher_tier_gives_less(self):
        self.assertCaught(lambda c: c["tiers"]["mid"]["event"].update(poster_designs_per_brand=5), "gives less than free")

    def test_higher_tier_drops_configuration(self):
        self.assertCaught(lambda c: c["tiers"]["premium"]["event"]["configuration"].remove("ready_made_looks"), "include everything")

    def test_bad_limit_value(self):
        self.assertCaught(lambda c: c["tiers"]["mid"]["event"].update(people_per_brand="ten"), "whole number")

    def test_missing_tier(self):
        self.assertCaught(lambda c: c["tiers"].pop("mid"), "tiers must be exactly")


class Brand(unittest.TestCase):
    def errs(self, mutate, folder=BRANDS):
        b = copy.deepcopy(BRAND)
        mutate(b)
        return cc.check_brand(b, CFG, folder, "test")

    def assertCaught(self, mutate, words, folder=BRANDS):
        errs = self.errs(mutate, folder)
        self.assertTrue(any(words in e for e in errs), f"expected {words!r} in {errs}")

    def test_template_passes(self):
        self.assertEqual(self.errs(lambda b: None), [])

    def test_more_than_tier_allows(self):
        self.assertCaught(lambda b: b["looks"]["configuration"].append("custom_arrangements"), "does not include")

    def test_too_many_people(self):
        self.assertCaught(lambda b: b["members"].extend([{"actor": "oa_actor_2", "role": "editor"}, {"actor": "oa_actor_3", "role": "viewer"}]), "allows 2 per brand")

    def test_person_name_in_brand(self):
        self.assertCaught(lambda b: b["members"][0].update(email="someone@example.com"), "person data")

    def test_member_not_opaque(self):
        self.assertCaught(lambda b: b["members"][0].update(actor="matt"), "opaque id")

    def test_no_owner(self):
        self.assertCaught(lambda b: b["members"][0].update(role="editor"), "needs one owner")

    def test_faith_paying(self):
        self.assertCaught(lambda b: b.update(sponsor_type="faith_organization", tier="mid"), "always on the free tier")

    def test_anonymous_attendee_brand(self):
        self.assertCaught(lambda b: b.update(corner="attendee_named", products=["ose"]), "named side only")

    def test_unknown_tier(self):
        self.assertCaught(lambda b: b.update(tier="gold"), "tier must be one of")

    def test_skin_with_colour_key(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "x.skin.md").write_text("---\nsurface: report\ncolor: red\n---\n")
            self.assertCaught(lambda b: b["looks"].update(skin_file="x.skin.md"), "not a skin key", Path(d))

    def test_skin_for_other_product_only(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "x.skin.md").write_text("---\nsurface: profile\nskin: standard\n---\n")
            self.assertCaught(lambda b: b["looks"].update(skin_file="x.skin.md"), "no block for this brand", Path(d))

    def test_missing_skin_file(self):
        self.assertCaught(lambda b: b["looks"].update(skin_file="nope.skin.md"), "not found")


if __name__ == "__main__":
    unittest.main()
