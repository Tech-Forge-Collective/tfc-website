from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
LANGS = ["en", "nl", "pl", "de", "es", "fr"]
I18N_ROUTES = [
    "",
    "technology",
    "projectile",
    "journal",
    "notes",
    "updates",
    "roadmap",
    "journal/why-gpt-is-not-enough-for-complex-engineering-organisations",
]
I18N_UTILITY_ROUTES = ["404", "offline"]
REQUIRED_I18N_KEYS = [
    "nav.home",
    "nav.technology",
    "hero.headline",
    "technologyLanes.headline",
    "principles.title",
    "projectile.summary",
    "publications.title",
    "journal.headline",
    "notes.headline",
    "updates.headline",
    "contact.cta",
    "footer.summary",
    "seo.homeTitle",
    "seo.homeDescription",
    "seo.notFoundTitle",
    "seo.offlineTitle",
    "seo.projectileTitle",
    "seo.roadmapTitle",
    "errors.notFoundText",
    "errors.offlineText",
    "errors.returnHome",
    "languageSwitcher.current",
    "languageSwitcher.button",
    "languageSwitcher.open",
    "languageSwitcher.close",
    "roadmap.headline",
    "strings.Skip to content",
    "strings.Loading orb",
    "strings.Fullscreen",
    "strings.Technology approach",
    "strings.Completed features",
    "strings.Known issues",
]
CRITICAL_ENGLISH_UI_STRINGS = [
    "Engineering technology for real industrial problems.",
    "Explore our technology",
    "See ProjecTile",
    "Loading orb",
    "Fullscreen",
    "Technology approach",
    "Built for technical work, not theatre",
    "Open ProjecTile",
    "Read the journal",
    "View updates",
    "Problem area:",
    "Engineering value:",
    "TFC approach:",
    "View latest update",
    "Open full roadmap",
    "Completed features",
    "Known issues",
    "Next priorities",
    "Search journal",
    "Search notes",
    "Notify Me",
    "Page not found.",
    "You are offline.",
    "Return Home",
    "Back to TFC Home",
    "Overview",
    "Engineering intelligence, forged for complex projects.",
    "View latest update",
    "Latest development signal",
    "Capability path",
    "Project context, technical evidence, deterministic tools, and specialists stay connected through a case-first workflow.",
    "Specialists, tools, reports, and readiness evidence work together instead of living in separate systems.",
    "Assumptions, gaps, evidence, and decisions are tracked so engineering progress can be reviewed and improved.",
    "Documents, reports, knowledge packs, and Engineering DNA form a connected source of truth.",
    "Current public work is focused on navigation clarity, ProjecTile product separation, roadmap presentation, structured updates, and production-grade website validation.",
]
CRITICAL_DUTCH_UI_STRINGS = [
    "Beweeg over een orb-kwadrant",
    "Praktische engineeringtechnologie voor industri",
    "Mobiele robotica, sensing",
    "Asset- en reliabilitytechnologie",
    "Engineeringkennissystemen",
    "Praktische industriele AI",
]
ROUTE_BY_SLUG = {
    "": "home",
    "technology": "technology",
    "projectile": "projectile",
    "journal": "journal",
    "notes": "notes",
    "updates": "updates",
    "roadmap": "roadmap",
    "journal/why-gpt-is-not-enough-for-complex-engineering-organisations": "articleGptNotEnough",
    "404": "notFound",
    "offline": "offline",
}
REQUIRED_FILES = [
    "index.html",
    "technology.html",
    "journal.html",
    "notes.html",
    "updates.html",
    "robots.txt",
    "sitemap.xml",
    "rss.xml",
    "manifest.json",
    "sw.js",
    "_headers",
]


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.meta_description = False
        self.canonical = False
        self.og_title = False
        self.twitter_card = False
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "meta" and data.get("name") == "description":
            self.meta_description = bool(data.get("content"))
        if tag == "meta" and data.get("property") == "og:title":
            self.og_title = bool(data.get("content"))
        if tag == "meta" and data.get("name") == "twitter:card":
            self.twitter_card = bool(data.get("content"))
        if tag == "link" and data.get("rel") == "canonical":
            self.canonical = bool(data.get("href"))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data.strip()


def assert_contains(text: str, needle: str, source: str) -> None:
    if needle not in text:
        fail(f"{source} missing required content: {needle}")


def nested_key(data: dict, dotted: str) -> bool:
    current = data
    for part in dotted.split("."):
        if not isinstance(current, dict) or part not in current:
            return False
        current = current[part]
    return bool(current)


def validate_homepage() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    script = (ROOT / "script.js").read_text(encoding="utf-8")

    for required in [
        "Engineering technology for real industrial problems.",
        "Explore our technology",
        "See ProjecTile",
        "Practical engineering technology for industrial environments",
        "Industrial AI",
        "Robotics",
        "Industrial Software",
        "Engineering Automation",
        "Engineering Intelligence",
        "Digital Engineering",
        "Asset / Reliability Technology",
        "Engineering Knowledge Systems",
        "Built by Tech Forge Collective",
        "Engineering Principles",
        "Flagship Platform",
        "ProjecTile is Tech Forge Collective's flagship Engineering Operating System",
        "Engineering Journal",
        "Engineering Notes",
        "Development Updates",
        "Contact / Collaboration",
    ]:
        assert_contains(html, required, "index.html")

    if html.count("Flagship Platform") != 1:
        fail("index.html should present ProjecTile as the single flagship platform")

    for product_name in ["Robotics Platform", "Industrial AI Platform", "Automation Platform"]:
        if product_name in html:
            fail(f"index.html exposes named public product: {product_name}")

    assert_contains(html, "home-background", "index.html")
    assert_contains(html, 'data-src="./face/index.html?embed=1"', "index.html")
    assert_contains(script, "prefers-reduced-motion: reduce", "script.js")
    assert_contains(script, "requestIdleCallback", "script.js")
    if "createRadialGradient(pointer" in script:
        fail("script.js contains cursor-follow glow in the background")


def validate_technology_page() -> None:
    html = (ROOT / "technology.html").read_text(encoding="utf-8")
    for required in [
        "Technology Lanes",
        "Industrial AI",
        "Robotics",
        "Industrial Software",
        "Automation",
        "Engineering Intelligence",
        "Digital Engineering",
        "Asset / Reliability Technology",
        "Engineering Knowledge Systems",
        "How the lanes come together in ProjecTile",
    ]:
        assert_contains(html, required, "technology.html")

    if "ProjecTile is designed as an Engineering Intelligence Platform" in html:
        fail("technology.html still uses ProjecTile-only positioning")

    if 'href="/projectile/"' not in html:
        fail("technology.html ProjecTile CTA/title must link to /projectile/")


def validate_projectile_experience() -> None:
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    projectile = (ROOT / "projectile" / "index.html").read_text(encoding="utf-8")
    roadmap = (ROOT / "roadmap" / "index.html").read_text(encoding="utf-8")
    updates = (ROOT / "updates" / "index.html").read_text(encoding="utf-8")

    if 'href="#projectile"' not in home:
        fail("home ProjecTile links must target #projectile")
    if "data-home-projectile-orb" not in home:
        fail("home ProjecTile orb must use homepage section behavior")
    if 'href="/projectile/"' not in home:
        fail("home ProjecTile section should offer a dedicated /projectile/ route")

    for required in [
        'class="projectile-product-nav"',
        'href="/">Back to TFC Home</a>',
        'href="#overview"',
        'href="#engineering-director"',
        'href="#knowledge-graph"',
        'href="#engineering-readiness"',
        'href="#engineering-dna"',
        'href="#workflows"',
        'href="#reports"',
        'href="#roadmap"',
        'href="#updates"',
        'data-src="/face/index.html?embed=1"',
    ]:
        assert_contains(projectile, required, "projectile/index.html")

    if projectile.count('class="projectile-feature-card"') < 6:
        fail("projectile/index.html should render product feature cards")

    for rel in ["index.html", "technology.html", "journal.html", "notes.html", "updates.html", "roadmap/index.html"]:
        html = (ROOT / rel).read_text(encoding="utf-8")
        if 'class="projectile-product-nav"' in html:
            fail(f"{rel} should not render the ProjecTile internal navigation")

    for required in [
        "Foundation",
        "Engineering Intelligence",
        "Knowledge Graph and Engineering Memory",
        "Engineering Learning",
        "Founder Review",
        "Public Demo",
        "roadmap-card",
        "progress-track",
        "roadmap-status",
    ]:
        assert_contains(roadmap, required, "roadmap/index.html")
    if roadmap.count('class="roadmap-card') < 6:
        fail("roadmap/index.html should render six structured roadmap cards")

    for required in [
        "structured-update-card",
        "Benchmark snapshot",
        "Completed features",
        "Graph growth",
        "Known issues",
        "Next priorities",
    ]:
        assert_contains(updates, required, "updates/index.html")
    if updates.count("structured-update-card") < 3:
        fail("updates/index.html should render multiple structured update cards")


def validate_public_product_language() -> None:
    forbidden = ["Robotics Platform", "Industrial AI Platform", "Automation Systems"]
    for rel in ["index.html", "products/index.html", "technology.html", "technology/index.html"]:
        text = (ROOT / rel).read_text(encoding="utf-8")
        for phrase in forbidden:
            if phrase in text:
                fail(f"{rel} exposes non-public product naming: {phrase}")


def validate_i18n() -> None:
    for lang in LANGS:
        path = ROOT / "i18n" / f"{lang}.json"
        if not path.exists():
            fail(f"missing translation file {path.relative_to(ROOT)}")
        data = json.loads(path.read_text(encoding="utf-8"))
        for key in REQUIRED_I18N_KEYS:
            if not nested_key(data, key):
                fail(f"{path.relative_to(ROOT)} missing translation key {key}")

        for route in [*I18N_ROUTES, *I18N_UTILITY_ROUTES]:
            page = ROOT / lang / route / "index.html"
            if not page.exists():
                fail(f"missing language route {page.relative_to(ROOT)}")
            html = page.read_text(encoding="utf-8")
            expected_canonical = f"https://techforgecollective.com/{lang}/" if not route else f"https://techforgecollective.com/{lang}/{route}"
            if f'<html lang="{lang}"' not in html:
                fail(f"{page.relative_to(ROOT)} missing html lang={lang}")
            if 'class="language-switcher"' not in html:
                fail(f"{page.relative_to(ROOT)} missing language switcher")
            if 'class="language-switcher-button"' not in html:
                fail(f"{page.relative_to(ROOT)} missing dropdown language button")
            if 'aria-haspopup="listbox"' not in html:
                fail(f"{page.relative_to(ROOT)} missing language menu listbox trigger")
            if 'aria-expanded="false"' not in html:
                fail(f"{page.relative_to(ROOT)} missing collapsed language menu state")
            if 'aria-controls="language-menu-' not in html:
                fail(f"{page.relative_to(ROOT)} missing language menu control binding")
            if 'role="listbox"' not in html:
                fail(f"{page.relative_to(ROOT)} missing language listbox")
            if html.count('role="option"') < len(LANGS):
                fail(f"{page.relative_to(ROOT)} missing language menu options")
            if f'class="language-current-code">{lang.upper()}' not in html:
                fail(f"{page.relative_to(ROOT)} missing current language code")
            if lang != "en":
                for english in CRITICAL_ENGLISH_UI_STRINGS:
                    if english in html:
                        fail(f"{page.relative_to(ROOT)} contains untranslated UI string: {english}")
            if lang not in {"en", "nl"}:
                for dutch in CRITICAL_DUTCH_UI_STRINGS:
                    if dutch in html:
                        fail(f"{page.relative_to(ROOT)} contains Dutch UI string: {dutch}")
            route_slug = route
            for other in LANGS:
                expected_href = f'/{other}/' if not route_slug else f'/{other}/{route_slug}/'
                if f'href="{expected_href}"' not in html:
                    fail(f"{page.relative_to(ROOT)} missing language route link {expected_href}")
            if f'<link rel="canonical" href="{expected_canonical}' not in html:
                fail(f"{page.relative_to(ROOT)} missing canonical {expected_canonical}")
            for other in LANGS:
                if f'hreflang="{other}"' not in html:
                    fail(f"{page.relative_to(ROOT)} missing hreflang {other}")
            if 'hreflang="x-default"' not in html:
                fail(f"{page.relative_to(ROOT)} missing x-default hreflang")

    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    for lang in LANGS:
        for route in I18N_ROUTES:
            url = f"https://techforgecollective.com/{lang}/" if not route else f"https://techforgecollective.com/{lang}/{route}"
            if url not in sitemap:
                fail(f"sitemap missing {url}")
        for route in I18N_UTILITY_ROUTES:
            url = f"https://techforgecollective.com/{lang}/{route}"
            if url in sitemap:
                fail(f"sitemap should not include noindex utility route {url}")

    script = (ROOT / "script.js").read_text(encoding="utf-8")
    for slug, logical in ROUTE_BY_SLUG.items():
        if logical not in script or f'slug: "{slug}"' not in script:
            fail(f"script.js route map missing logical route {logical}:{slug}")
    if "validTargetHash" not in script:
        fail("script.js missing anchor validation for language switching")
    if "window.location.hash && link.href" in script:
        fail("script.js still appends anchors blindly during language switching")


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            fail(f"missing {rel}")

    for rel in ["index.html", "technology.html", "journal.html", "notes.html", "updates.html"]:
        parser = LinkParser()
        parser.feed((ROOT / rel).read_text(encoding="utf-8"))
        if not parser.title:
            fail(f"{rel} missing title")
        if not parser.meta_description:
            fail(f"{rel} missing meta description")
        if rel == "index.html" and not (parser.canonical and parser.og_title and parser.twitter_card):
            fail("index.html missing sharing/canonical metadata")

    validate_homepage()
    validate_technology_page()
    validate_projectile_experience()
    validate_public_product_language()
    validate_i18n()
    for rel in ["404/index.html", "offline/index.html"]:
        if not (ROOT / rel).exists():
            fail(f"missing clean utility route {rel}")

    ET.parse(ROOT / "sitemap.xml")
    ET.parse(ROOT / "rss.xml")
    print("Website validation passed.")


if __name__ == "__main__":
    main()

