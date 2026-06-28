from __future__ import annotations

import argparse
from html.parser import HTMLParser
import sys
import urllib.request


LANGS = ["en", "nl", "pl", "de", "es", "fr"]
ROUTES = [
    "",
    "technology",
    "projectile",
    "journal",
    "notes",
    "updates",
    "roadmap",
    "journal/why-gpt-is-not-enough-for-complex-engineering-organisations",
    "404",
    "offline",
]

DUTCH_LEAKS = [
    "wordt gebouwd",
    "Van losse bestanden",
    "Toekomstige engineeringspecialisten",
    "Stel betere vragen",
    "AI-systemen ontworpen",
    "Doelgerichte software",
    "herhaalbaar engineeringwerk",
    "Systemen die kennis",
    "Technologisch denken",
    "Kennisstructuren",
    "Engineeringtools hebben",
    "Projecten moeten",
    "Behandel robotica",
    "Deze publieke roadmap",
    "Toegewijde interne",
    "Roadmap- en updatepagina",
]

ARTICLE_ENGLISH_LEAKS = [
    "Language models are useful engineering assistants",
    "Engineering organisations do not operate only through conversation",
    "A single large language model can reason over text",
    "When a deterministic method exists",
]

LANGUAGE_NAMES = {
    "en": ["EN", "English"],
    "nl": ["NL", "Nederlands"],
    "pl": ["PL", "Polski"],
    "de": ["DE", "Deutsch"],
    "es": ["ES", "Español"],
    "fr": ["FR", "Français"],
}


class TextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.text: list[str] = []

    def handle_data(self, data: str) -> None:
        value = " ".join(data.split())
        if value:
            self.text.append(value)


def fetch(base_url: str, lang: str, route: str) -> str:
    suffix = f"{route}/" if route else ""
    url = f"{base_url.rstrip('/')}/{lang}/{suffix}"
    with urllib.request.urlopen(url, timeout=15) as response:
        return response.read().decode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:8131")
    args = parser.parse_args()
    failures: list[str] = []

    for lang in LANGS:
        for route in ROUTES:
            html = fetch(args.base_url, lang, route)
            visible = TextParser()
            visible.feed(html)
            text = "\n".join(visible.text)
            rel = f"/{lang}/{route}/" if route else f"/{lang}/"

            if f'<html lang="{lang}"' not in html:
                failures.append(f"{rel} has wrong html lang")
            if 'class="language-switcher"' not in html:
                failures.append(f"{rel} missing language switcher")
            for code, required in LANGUAGE_NAMES.items():
                if not all(item in html for item in required):
                    failures.append(f"{rel} missing language selector entry {code}")
            if "data-i18n-fallback" in html:
                failures.append(f"{rel} contains fallback marker")
            if lang not in {"en", "nl"}:
                for phrase in DUTCH_LEAKS:
                    if phrase in text:
                        failures.append(f"{rel} contains Dutch leak: {phrase}")
            if lang != "en" and "why-gpt-is-not-enough" in route:
                for phrase in ARTICLE_ENGLISH_LEAKS:
                    if phrase in text:
                        failures.append(f"{rel} contains English article leak: {phrase}")

    if failures:
        print("Rendered i18n QA failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("Rendered i18n QA passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
