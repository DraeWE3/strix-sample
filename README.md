# Strix Production website

Static single-page site for <https://www.strixproduction.com> (Vite 7, React 19, React Router 7), plus the
Strix Content Studio at <https://admin.strixproduction.com>. Content lives in Cloud Firestore; the contact form
sends through EmailJS; studio image uploads go to Cloudinary. There is no backend server: Firestore security
rules are the only server-side access control.

## Setup

```sh
npm ci
cp .env.example .env   # fill in the VITE_* values
npm run dev            # site on :5173
npm run dev:admin      # studio on :5174
```

## Checks

| Command | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm test` | Unit tests: studio backend (fake Firestore), public data layer, SEO generators, contact form, carousel |
| `npm run test:build` | Two real builds with networking cut off (Linux `unshare`): a Firestore outage must fail the build |
| `npm run verify:release` | Checks `dist/` is a complete, untouched release (manifest hashes, every page's head, sitemap, `.htaccess`) |
| `npm run verify:admin` | Checks `dist-admin/` |

## Building a release

`npm run build` reads the published blogs and case studies from Firestore (server reads only, before `dist/`
is emptied) and writes, next to the bundle:

- a prerendered `<head>` for every page (`works.html`, `services/web-dev.html`, `blog/<id>.html`, …),
  `app.html` (shell for content published after the build) and `404.html`;
- `sitemap.xml` and `llms.txt` (indexable pages only);
- `.htaccess` with the generated legacy and lower-case redirects (`src/data/legacyRoutes.js`);
- `release-manifest.json` (SHA-256 of every file).

If Firestore can't be read, or a content group that the previous build had comes back empty, **the build fails
and the previous `dist/` is left as it was.** `npm run build:offline` (`STRIX_PRERENDER_OFFLINE=1`) builds
without blogs and case studies for local work; it is marked `NOT-FOR-RELEASE.txt` and `verify:release` rejects it.

New, changed or unpublished CMS content reaches the prerendered pages and sitemap only with the next build and
deploy. Rebuild after publishing.

## Deploying to Hostinger (manual)

1. `npm run build && npm run verify:release` and `npm run build:admin && npm run verify:admin`.
2. Upload `dist/assets/` to `public_html/assets/` first (old hashed files can stay until step 5).
3. Upload the rest of `dist/` — including the hidden `.htaccess` — to `public_html/`, HTML files last.
4. Upload `dist-admin/` (with its `.htaccess`) to `public_html/admin/`.
5. Download a copy of `public_html` and run `node scripts/verify-release.mjs dist --compare <copy>` to list stale
   files (e.g. old `uiux.html`), then delete those on the server.
6. Check: `curl -sI https://www.strixproduction.com/services/ui-ux-design` (200), `/uiux` (301),
   `http://strixproduction.com/works` (one 301 to `https://www.…/works`), `/assets/nope.js` (404).

`.htaccess` answers 404 for `release-manifest.json` and `NOT-FOR-RELEASE.txt`. Only upload the build folders; never
upload `.env` or the repository itself.

## Firebase security rollout

Proposed rules are in `firestore.rules` (not deployed from here). Order matters:

1. Firestore → create `admins/{uid}` for every studio user (uid from Authentication → Users), or give them the
   `admin` custom claim.
2. Authentication → Settings → User actions → turn off **Enable create (sign-up)**.
3. Deploy the public site build (it only queries `status == 'published'`; no composite index is needed).
4. Test the rules in the emulator or Rules Playground (anonymous read of a draft project, case study and chunk must
   be denied; an admin write must succeed), then `firebase deploy --only firestore:rules`.
5. Deploy the studio build.

## EmailJS

`emailjs/lead-template.html` lists the template settings. The recipient must be typed into the template's
**To Email** field (`info@strixproduction.com`) — the site no longer sends it. Also restrict allowed domains and set a
rate limit in the EmailJS account security settings. To use reCAPTCHA v2, enable it on the template and set
`VITE_RECAPTCHA_SITE_KEY` in the same release.

## Cloudinary

The studio uses an unsigned upload preset, whose name is public in the studio bundle. In Cloudinary → Upload presets,
restrict it to image formats (jpg, png, webp, gif), a maximum file size (20 MB), a fixed folder, and disable
overwrite; or move to signed uploads.
