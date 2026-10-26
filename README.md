# Strix Production website

Static single-page site for <https://www.strixproduction.com> (Vite 7, React 19, React Router 7), plus the
Strix Content Studio at <https://admin.strixproduction.com>. Content lives in Neon Postgres, read and written from
the browser through the Neon Data API, with Neon Auth for studio sign-in; the contact form sends through EmailJS;
studio image uploads go to Cloudinary. There is no backend server of our own: row-level security in
`db/schema.sql` is the only server-side access control.

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
| `npm test` | Unit tests: studio backend (fake Neon Data API), public data layer, SEO generators, contact form, carousel |
| `npm run test:build` | Two real builds with networking cut off (Linux `unshare`): a Neon outage must fail the build |
| `npm run verify:release` | Checks `dist/` is a complete, untouched release (manifest hashes, every page's head, sitemap, `.htaccess`) |
| `npm run verify:admin` | Checks `dist-admin/` |

## Building a release

`npm run build` reads the published blogs and case studies from Neon (as an anonymous visitor, before `dist/`
is emptied) and writes, next to the bundle:

- a prerendered `<head>` for every page (`works.html`, `services/web-dev.html`, `blog/<id>.html`, …),
  `app.html` (shell for content published after the build) and `404.html`;
- `sitemap.xml` and `llms.txt` (indexable pages only);
- `.htaccess` with the generated legacy and lower-case redirects (`src/data/legacyRoutes.js`);
- `release-manifest.json` (SHA-256 of every file).

If Neon can't be read, or a content group that the previous build had comes back empty, **the build fails
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

## Neon database

Tables, grants and row-level security are in `db/schema.sql`. Each table keeps the former Firestore document as a
`data` JSON column under the same id, so `/blog/:id` and `/case-study/:id` URLs are unchanged. Visitors use Neon
Auth's anonymous token (Postgres role `anonymous`) and see `status = 'published'` rows only; only users listed in
`admins` can write. Pages refresh their content when the tab is shown again and every five minutes (the Data API
has no real-time feed).

Setup on a new branch, in this order:

1. Neon Console → the project → **Data API** → enable it with **Use Neon Auth**. Add
   `https://www.strixproduction.com`, `https://admin.strixproduction.com` and `http://localhost:5173`/`5174` to Neon
   Auth's trusted domains, allow anonymous access, and turn off public sign-up.
2. `.env`: `VITE_NEON_DATA_API_URL`, `VITE_NEON_AUTH_URL` (both shown on the Data API page) and `DATABASE_URL`
   (Connect → owner connection string; used only by the scripts, never bundled).
3. `npm run db:schema` (or paste `db/schema.sql` into the SQL Editor). Safe to re-run.
4. Create each studio user in Neon Console → Auth, then `npm run db:admin -- name@example.com`.

### Moving the content from Firestore

The content was exported from Firestore to `../data/` (`projects.json`, `caseStudies.json`, `blogs.json`: arrays of
`{ id, data }`, case studies with their `chunks`). `npm run db:migrate -- --dry-run` counts what would be copied;
`npm run db:migrate` copies every project, case study (chunks folded in) and blog, drafts included, in one
transaction. It upserts by id and never deletes, so it can be re-run. Use `-- --from <dir>` for another export folder.

## EmailJS

`emailjs/lead-template.html` lists the template settings. The recipient must be typed into the template's
**To Email** field (`info@strixproduction.com`) — the site no longer sends it. Also restrict allowed domains and set a
rate limit in the EmailJS account security settings. To use reCAPTCHA v2, enable it on the template and set
`VITE_RECAPTCHA_SITE_KEY` in the same release.

## Cloudinary

The studio uses an unsigned upload preset, whose name is public in the studio bundle. In Cloudinary → Upload presets,
restrict it to image formats (jpg, png, webp, gif), a maximum file size (20 MB), a fixed folder, and disable
overwrite; or move to signed uploads.
