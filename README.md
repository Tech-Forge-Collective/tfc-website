# Tech Forge Collective Website

Public website for Tech Forge Collective and the ProjecTile product presence.

## Status

Migration staging repository created from the former local TFC development workspace.

## Purpose

This repository contains the public static website, including the home page, technology page, engineering journal, engineering notes, development updates, SEO assets, RSS, sitemap, and the face-app orb integration used on the ProjecTile teaser.

## Setup

No build step is required for the current static site.

## Run

```powershell
python -m http.server 8120
```

Open `http://127.0.0.1:8120`.

## Test

Run static checks:

```powershell
python tools\validate_site.py
```

## Architecture

The site is static HTML/CSS/JS with local assets, a service worker, sitemap, RSS feed, manifest, and face-app assets. It should remain deployable to GitHub Pages, Netlify, Cloudflare Pages, or any static host.

## Related Repositories

- `projectile`: private ProjecTile Engineering Operating System.
- `tfc-standards`: shared engineering standards and templates.
- `engineering-notes`: optional public long-form engineering notes.
