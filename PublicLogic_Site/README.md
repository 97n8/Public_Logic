# PublicLogic Website

This is a lightweight, multi-page website for PublicLogic™. It is static, vendor-agnostic, and easy to host on GitHub Pages, Netlify, Cloudflare Pages, S3, or any web server.

## Structure
- `index.html` — Home
- `framework.html` — Canonical Framework page (embeds your uploaded artifact with print support)
- `solutions.html` — Modules & Programs
- `partners.html` — Partner model
- `research.html` — Insight & Pulse methods
- `case-studies.html` — Representative work
- `about.html` — Mission and principles
- `contact.html` — Contact form (replace `action` with your endpoint)
- `assets/css/styles.css` — Global CSS
- `assets/js/main.js` — Small UX helpers
- `assets/img/logo.svg` — Logo
- `robots.txt`, `sitemap.xml`, `favicon.ico`

## Notes
- Replace the form `action` in `contact.html` with your real endpoint.
- For Google Fonts privacy, you may self-host the Inter font if preferred.
- To add analytics, include your script in the footer before `</body>`.

## Deploy
- Commit this folder to a repo.
- Enable GitHub Pages with the `root` as the publishing source, or drag-and-drop to Netlify.