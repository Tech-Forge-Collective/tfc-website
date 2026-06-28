# Deployment

The website is currently a static site and can be deployed by publishing the repository root.

## Static Host

Recommended options:

- GitHub Pages for simple public hosting.
- Netlify or Cloudflare Pages for branch previews and headers support.

## Pre-Deploy Checks

```powershell
python -m http.server 8120
```

Verify:

- Home page loads.
- `/technology.html`, `/journal.html`, `/notes.html`, and `/updates.html` load.
- `robots.txt`, `sitemap.xml`, `rss.xml`, `manifest.json`, and `_headers` are present.
- Lighthouse SEO and accessibility remain green.

## Headers

The `_headers` file contains static-host security/cache hints. Confirm the selected host supports this format or translate the headers to the host configuration.

