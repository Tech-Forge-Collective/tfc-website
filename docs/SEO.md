# SEO

The site includes:

- `robots.txt`
- `sitemap.xml`
- `rss.xml`
- canonical tags
- Open Graph tags
- Twitter Card tags
- JSON-LD metadata
- web app manifest
- favicon assets

## Indexing Rules

Public website pages should be indexable. Internal app routes, local test artifacts, screenshots, and generated reports should not be published.

## Validation

Use Lighthouse and manual source inspection before release:

```powershell
python -m http.server 8120
```

Confirm page titles, descriptions, canonical URLs, share images, and structured data match the production domain.

