# Testing

The website is currently static. Run a local static server and inspect the public pages before deployment.

```powershell
cd tfc-website
python -m http.server 8120
```

Recommended checks:

- Home page loads.
- Technology, Journal, Notes, and Updates pages load.
- `robots.txt`, `sitemap.xml`, `rss.xml`, `manifest.json`, and `_headers` are present.
- Lighthouse returns strong SEO/accessibility scores.

Automated static validation:

```powershell
python tools\validate_site.py
```
