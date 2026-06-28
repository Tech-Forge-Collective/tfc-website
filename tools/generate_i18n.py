from __future__ import annotations

import json
import re
import shutil
from html import escape
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree, register_namespace


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://techforgecollective.com"
LANGS = ["en", "nl", "pl", "de", "es", "fr"]
OG_LOCALE = {
    "en": "en_US",
    "nl": "nl_NL",
    "pl": "pl_PL",
    "de": "de_DE",
    "es": "es_ES",
    "fr": "fr_FR",
}

ROUTES = {
    "home": {"source": "index.html", "slug": "", "seo": ("homeTitle", "homeDescription")},
    "technology": {"source": "technology.html", "slug": "technology", "seo": ("technologyTitle", "technologyDescription")},
    "projectile": {"source": "projectile/index.html", "slug": "projectile", "seo": ("projectileTitle", "projectileDescription")},
    "journal": {"source": "journal.html", "slug": "journal", "seo": ("journalTitle", "journalDescription")},
    "notes": {"source": "notes.html", "slug": "notes", "seo": ("notesTitle", "notesDescription")},
    "updates": {"source": "updates.html", "slug": "updates", "seo": ("updatesTitle", "updatesDescription")},
    "roadmap": {"source": "roadmap/index.html", "slug": "roadmap", "seo": ("roadmapTitle", "roadmapDescription")},
    "article_gpt": {
        "source": "journal-why-gpt-is-not-enough-for-complex-engineering-organisations.html",
        "slug": "journal/why-gpt-is-not-enough-for-complex-engineering-organisations",
        "seo": ("articleTitle", "articleDescription"),
        "fallback_body": True,
    },
    "error_404": {"source": "404.html", "slug": "404", "seo": ("notFoundTitle", "notFoundDescription"), "sitemap": False},
    "offline": {"source": "offline.html", "slug": "offline", "seo": ("offlineTitle", "offlineDescription"), "sitemap": False},
}

EXTRA_SITEMAP_ROUTES = ["products", "contact", "privacy", "terms"]
LANGUAGE_FLAGS = {
    "en": "&#x1F1EC;&#x1F1E7;",
    "nl": "&#x1F1F3;&#x1F1F1;",
    "pl": "&#x1F1F5;&#x1F1F1;",
    "de": "&#x1F1E9;&#x1F1EA;",
    "es": "&#x1F1EA;&#x1F1F8;",
    "fr": "&#x1F1EB;&#x1F1F7;",
}


def load_translations() -> dict[str, dict]:
    return {
        lang: json.loads((ROOT / "i18n" / f"{lang}.json").read_text(encoding="utf-8"))
        for lang in LANGS
    }


def deep_get(data: dict, dotted: str) -> str:
    current = data
    for part in dotted.split("."):
        current = current[part]
    return str(current)


def localized_path(lang: str, slug: str) -> str:
    prefix = f"/{lang}"
    return f"{prefix}/" if not slug else f"{prefix}/{slug}/"


def canonical_url(lang: str, slug: str) -> str:
    if lang == "default":
        return f"{ORIGIN}/" if not slug else f"{ORIGIN}/{slug}"
    return f"{ORIGIN}{localized_path(lang, slug).rstrip('/') if slug else localized_path(lang, slug)}"


def hreflang_tags(slug: str) -> str:
    tags = [f'    <link rel="alternate" hreflang="x-default" href="{canonical_url("default", slug)}">']
    for lang in LANGS:
        href = canonical_url(lang, slug)
        tags.append(f'    <link rel="alternate" hreflang="{lang}" href="{href}">')
    return "\n".join(tags)


def switcher_html(lang: str, slug: str, labels: dict, placement: str) -> str:
    links = []
    menu_id = f"language-menu-{placement}-{lang}-{slug.replace('/', '-') or 'home'}"
    for code in LANGS:
        href = localized_path(code, slug)
        aria_current = ' aria-current="true"' if code == lang else ""
        aria_selected = "true" if code == lang else "false"
        links.append(
            f'<a role="option" aria-selected="{aria_selected}" href="{href}" data-lang="{code}" lang="{code}"{aria_current}>'
            f'<span class="language-flag" aria-hidden="true">{LANGUAGE_FLAGS[code]}</span>'
            f'<span class="language-code">{code.upper()}</span>'
            f'<span class="language-name">{escape(labels[code])}</span>'
            "</a>"
        )
    return (
        f'<nav class="language-switcher" aria-label="{escape(labels["label"])}" data-current-lang="{lang}">'
        f'<button class="language-switcher-button" type="button" aria-haspopup="listbox" aria-expanded="false" '
        f'aria-controls="{menu_id}" aria-label="{escape(labels.get("open", labels["label"]))}">'
        f'<span class="language-globe" aria-hidden="true">&#9678;</span>'
        f'<span class="language-button-label">{escape(labels.get("button", labels["label"]))}</span>'
        f'<span class="language-current-code">{lang.upper()}</span>'
        f'<span class="language-arrow" aria-hidden="true">&#9662;</span>'
        f'</button>'
        f'<div class="language-switcher-menu" id="{menu_id}" role="listbox" hidden>'
        + "".join(links)
        + "</div>"
        + "</nav>"
    )


def set_or_insert_meta(html: str, selector: str, attr: str, value: str) -> str:
    escaped = escape(value, quote=True)
    pattern = rf'(<meta\s+{selector}\s+content=")[^"]*(")'
    if re.search(pattern, html):
        return re.sub(pattern, rf'\1{escaped}\2', html, count=1)
    return html.replace("</head>", f'    <meta {selector} content="{escaped}">\n  </head>', 1)


def set_title_and_meta(html: str, title: str, description: str, lang: str, slug: str) -> str:
    canonical = canonical_url(lang, slug) if lang != "default" else canonical_url("default", slug)
    html = re.sub(r'<html lang="[^"]+"', f'<html lang="{lang if lang != "default" else "en"}"', html, count=1)
    html = re.sub(r"<title>.*?</title>", f"<title>{escape(title)}</title>", html, count=1, flags=re.S)
    html = set_or_insert_meta(html, 'name="description"', "content", description)
    html = set_or_insert_meta(html, 'property="og:title"', "content", title)
    html = set_or_insert_meta(html, 'property="og:description"', "content", description)
    html = set_or_insert_meta(html, 'name="twitter:title"', "content", title)
    html = set_or_insert_meta(html, 'name="twitter:description"', "content", description)
    if lang != "default":
        html = set_or_insert_meta(html, 'property="og:locale"', "content", OG_LOCALE[lang])
    else:
        html = set_or_insert_meta(html, 'property="og:locale"', "content", OG_LOCALE["en"])
    if re.search(r'<link rel="canonical" href="[^"]+">', html):
        html = re.sub(r'<link rel="canonical" href="[^"]+">', f'<link rel="canonical" href="{canonical}">', html, count=1)
    else:
        html = html.replace("</head>", f'    <link rel="canonical" href="{canonical}">\n  </head>', 1)
    html = re.sub(r'\n\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+">', "", html)
    canonical_tag = re.search(r'<link rel="canonical" href="[^"]+">', html).group(0)
    html = html.replace(canonical_tag, canonical_tag + "\n" + hreflang_tags(slug), 1)
    html = html.replace('data-i18n-fallback="article-body-en"', "")
    return html


def absolutize_assets(html: str) -> str:
    replacements = {
        'href="./styles.css"': 'href="/styles.css"',
        'href="./manifest.json"': 'href="/manifest.json"',
        'href="./assets/': 'href="/assets/',
        'src="./assets/': 'src="/assets/',
        'href="./rss.xml"': 'href="/rss.xml"',
        'src="./script.js"': 'src="/script.js"',
        'data-src="./face/': 'data-src="/face/',
        'href="./face/': 'href="/face/',
    }
    for old, new in replacements.items():
        html = html.replace(old, new)
    return html


def localize_links(html: str, lang: str) -> str:
    link_map = {
        './index.html': f'/{lang}/',
        './technology.html': f'/{lang}/technology/',
        './technology.html#industrial-ai': f'/{lang}/technology/#industrial-ai',
        './technology.html#robotics': f'/{lang}/technology/#robotics',
        './journal.html': f'/{lang}/journal/',
        './notes.html': f'/{lang}/notes/',
        './updates.html': f'/{lang}/updates/',
        '/projectile/': f'/{lang}/projectile/',
        '/roadmap/': f'/{lang}/roadmap/',
        '/updates/': f'/{lang}/updates/',
        './journal-why-gpt-is-not-enough-for-complex-engineering-organisations.html': f'/{lang}/journal/why-gpt-is-not-enough-for-complex-engineering-organisations/',
        './journal-deterministic-engineering-calculations.html': '/journal-deterministic-engineering-calculations.html',
        './contact/': '/contact/',
        './about/': '/about/',
        './products/': '/products/',
        './roadmap/': '/roadmap/',
        './projectile/': '/projectile/',
        './privacy/': '/privacy/',
        './terms/': '/terms/',
        '/technology/': f'/{lang}/technology/',
        '/journal/': f'/{lang}/journal/',
        '/notes': f'/{lang}/notes/',
        '/updates': f'/{lang}/updates/',
    }
    for old, new in link_map.items():
        html = html.replace(f'href="{old}"', f'href="{new}"')
    html = re.sub(r'href="\./technology\.html#([^"]+)"', rf'href="/{lang}/technology/#\1"', html)
    html = html.replace('href="/"', f'href="/{lang}/"')
    return html


def localize_text(html: str, tr: dict, route_key: str) -> str:
    replacements = {
        "Tech Forge Collective": deep_get(tr, "footer.company"),
        "Engineering technology for real industrial problems.": deep_get(tr, "hero.headline"),
        "Explore our technology": deep_get(tr, "hero.ctaPrimary"),
        "See ProjecTile": deep_get(tr, "hero.ctaSecondary"),
        "Technology Lanes": deep_get(tr, "technologyLanes.eyebrow"),
        "Practical industrial technology, built on engineering.": deep_get(tr, "technologyLanes.headline"),
        "Engineering Principles": deep_get(tr, "principles.title"),
        "Flagship Platform": deep_get(tr, "projectile.eyebrow"),
        "ProjecTile is Tech Forge Collective's flagship Engineering Operating System for engineering teams, knowledge, workflows, reports, deterministic tools, and engineering readiness.": deep_get(tr, "projectile.summary"),
        "Explore ProjecTile": deep_get(tr, "projectile.cta"),
        "Research, notes, and transparent progress": deep_get(tr, "publications.title"),
        "Engineering Journal": deep_get(tr, "publications.journal"),
        "Engineering Notes": deep_get(tr, "publications.notes"),
        "ProjecTile Development Updates": deep_get(tr, "publications.updates"),
        "Contact / Collaboration": deep_get(tr, "contact.title"),
        "Contact Tech Forge Collective": deep_get(tr, "contact.cta"),
        "Building intelligent engineering systems for industry.": deep_get(tr, "footer.summary"),
    }
    route_specific = {
        "journal": {"Research, experiments, design decisions, and lessons learned while building engineering intelligence.": deep_get(tr, "journal.headline")},
        "notes": {"Short technical updates from the ProjecTile build.": deep_get(tr, "notes.headline")},
        "updates": {"Development Updates": deep_get(tr, "updates.eyebrow"), "Transparent progress on the ProjecTile Engineering Operating System.": deep_get(tr, "updates.headline")},
        "roadmap": {"ProjecTile Roadmap": deep_get(tr, "roadmap.eyebrow"), "Building an Engineering Operating System one capability at a time.": deep_get(tr, "roadmap.headline")},
        "error_404": {
            "Page not found.": deep_get(tr, "errors.notFound"),
            "The requested ProjecTile page is not available.": deep_get(tr, "errors.notFoundText"),
            "The requested Tech Forge Collective page is not available.": deep_get(tr, "errors.notFoundText"),
            "Return Home": deep_get(tr, "errors.returnHome"),
            "Engineering Journal": deep_get(tr, "nav.journal"),
        },
        "offline": {
            "ProjecTile is temporarily unavailable.": deep_get(tr, "errors.offline"),
            "Reconnect to load the latest Engineering Journal and teaser experience.": deep_get(tr, "errors.offlineText"),
            "Reconnect to load the latest Tech Forge Collective website.": deep_get(tr, "errors.offlineText"),
            "Return Home": deep_get(tr, "errors.returnHome"),
        },
    }
    replacements.update(tr.get("strings", {}))
    replacements.update(route_specific.get(route_key, {}))
    for old, new in sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True):
        pattern = re.escape(old).replace(r"\ ", r"\s+")
        html = re.sub(pattern, lambda _match, value=new: value, html)
    return html


def update_nav_labels(html: str, tr: dict) -> str:
    nav = tr["nav"]
    for english, key in [
        ("Home", "home"),
        ("Technology", "technology"),
        ("Products", "products"),
        ("Journal", "journal"),
        ("Notes", "notes"),
        ("Updates", "updates"),
        ("Contact", "contact"),
        ("ProjecTile", "projectile"),
        ("RSS", "rss"),
    ]:
        html = re.sub(rf'(>){re.escape(english)}(<)', rf'\1{escape(nav[key])}\2', html)
    return html


def inject_language_switcher(html: str, lang: str, slug: str, tr: dict) -> str:
    html = re.sub(r'<nav class="language-switcher".*?</nav>', "", html, flags=re.S)
    html = re.sub(r'\s*<footer class="site-language-footer">.*?</footer>', "", html, flags=re.S)
    header_switcher = switcher_html(lang, slug, tr["languageSwitcher"], "header")
    footer_switcher = switcher_html(lang, slug, tr["languageSwitcher"], "footer")
    html = html.replace("</header>", f"        {header_switcher}\n    </header>", 1)
    if "</body>" in html:
        html = html.replace("</body>", f'    <footer class="site-language-footer">{footer_switcher}</footer>\n  </body>', 1)
    return html


def render_page(route_key: str, route: dict, lang: str, tr: dict) -> str:
    html = (ROOT / route["source"]).read_text(encoding="utf-8")
    slug = route["slug"]
    title = deep_get(tr, f"seo.{route['seo'][0]}")
    description = deep_get(tr, f"seo.{route['seo'][1]}")
    html = absolutize_assets(html)
    html = localize_links(html, lang)
    if route_key == "projectile":
        html = html.replace(f'href="/{lang}/"', 'href="/"')
    html = localize_text(html, tr, route_key)
    html = update_nav_labels(html, tr)
    html = localize_text(html, tr, route_key)
    html = set_title_and_meta(html, title, description, lang, slug)
    if route.get("fallback_body"):
        html = html.replace("<body", '<body data-i18n-fallback="article-body-en"', 1)
    html = inject_language_switcher(html, lang, slug, tr)
    if '<script src="/script.js"></script>' not in html and "journal.js" not in html:
        html = html.replace("</body>", '    <script src="/script.js"></script>\n  </body>', 1)
    return html


def write_language_routes(translations: dict[str, dict]) -> None:
    for lang in LANGS:
        tr = translations[lang]
        for route_key, route in ROUTES.items():
            html = render_page(route_key, route, lang, tr)
            out_dir = ROOT / lang / route["slug"]
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / "index.html").write_text(html, encoding="utf-8")


def update_default_pages(translations: dict[str, dict]) -> None:
    tr = translations["en"]
    for route_key, route in ROUTES.items():
        html = (ROOT / route["source"]).read_text(encoding="utf-8")
        title = deep_get(tr, f"seo.{route['seo'][0]}")
        description = deep_get(tr, f"seo.{route['seo'][1]}")
        html = localize_text(html, tr, route_key)
        html = update_nav_labels(html, tr)
        html = localize_text(html, tr, route_key)
        html = set_title_and_meta(html, title, description, "default", route["slug"])
        html = inject_language_switcher(html, "en", route["slug"], tr)
        (ROOT / route["source"]).write_text(html, encoding="utf-8")
        if not route.get("sitemap", True):
            clean_html = absolutize_assets(html).replace('href="./journal.html"', 'href="/journal/"')
            out_dir = ROOT / route["slug"]
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / "index.html").write_text(clean_html, encoding="utf-8")


def write_sitemap() -> None:
    register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    register_namespace("xhtml", "http://www.w3.org/1999/xhtml")
    urlset = Element("{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
    for route in ROUTES.values():
        if not route.get("sitemap", True):
            continue
        slug = route["slug"]
        urls = [canonical_url("default", slug)] + [canonical_url(lang, slug) for lang in LANGS]
        for loc in urls:
            url = SubElement(urlset, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
            SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = loc
            SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text = "2026-06-28"
            SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}changefreq").text = "weekly"
            for lang in ["x-default", *LANGS]:
                href = canonical_url("default", slug) if lang == "x-default" else canonical_url(lang, slug)
                SubElement(url, "{http://www.w3.org/1999/xhtml}link", rel="alternate", hreflang=lang, href=href)
    for slug in EXTRA_SITEMAP_ROUTES:
        url = SubElement(urlset, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = f"{ORIGIN}/{slug}/"
        SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text = "2026-06-28"
        SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}changefreq").text = "weekly"
    ElementTree(urlset).write(ROOT / "sitemap.xml", encoding="utf-8", xml_declaration=True)


def main() -> None:
    translations = load_translations()
    write_language_routes(translations)
    update_default_pages(translations)
    write_sitemap()


if __name__ == "__main__":
    main()
