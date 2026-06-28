from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
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

    ET.parse(ROOT / "sitemap.xml")
    ET.parse(ROOT / "rss.xml")
    print("Website validation passed.")


if __name__ == "__main__":
    main()

