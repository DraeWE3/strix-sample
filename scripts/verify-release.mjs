#!/usr/bin/env node
/**
 * Decides whether a build folder is safe to upload.
 *
 *   node scripts/verify-release.mjs [dist]                 public site
 *   node scripts/verify-release.mjs --admin [dist-admin]   content studio
 *   node scripts/verify-release.mjs dist --compare <mirror>
 *       also lists files in <mirror> (e.g. a download of public_html) that
 *       this release does not contain, i.e. stale files to delete after upload.
 *
 * Exit code 0 = ready, 1 = problems found.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const admin = args.includes('--admin');
const compareIndex = args.indexOf('--compare');
const mirror = compareIndex >= 0 ? resolve(args[compareIndex + 1] || '') : null;
const positional = args.filter((arg, index) => !arg.startsWith('--') && !(compareIndex >= 0 && index === compareIndex + 1));
const dir = resolve(positional[0] || (admin ? 'dist-admin' : 'dist'));

const problems = [];
const notes = [];
const fail = (message) => problems.push(message);

const listFiles = async (root) => {
  const walk = async (current) => {
    const entries = await readdir(current, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => (entry.isDirectory() ? walk(join(current, entry.name)) : [join(current, entry.name)])));
    return nested.flat();
  };
  return (await walk(root)).map((file) => relative(root, file).split('\\').join('/'));
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const referencedAssets = (html) => [...html.matchAll(/(?:src|href)="\/(assets\/[^"?#]+)"/g)].map((match) => match[1]);

const checkAssets = async (file, html) => {
  for (const asset of referencedAssets(html)) {
    if (!existsSync(join(dir, asset))) fail(`${file} references /${asset}, which is not in the build.`);
  }
};

const count = (html, pattern) => (html.match(pattern) || []).length;

const verifyAdmin = async (files) => {
  for (const required of ['index.html', '.htaccess', 'robots.txt']) if (!files.includes(required)) fail(`Missing ${required}.`);
  if (files.includes('index.html')) {
    const html = await readFile(join(dir, 'index.html'), 'utf8');
    if (!/<meta name="robots" content="noindex,nofollow"/.test(html)) fail('index.html is not marked noindex.');
    await checkAssets('index.html', html);
  }
  if (files.includes('.htaccess')) {
    const htaccess = await readFile(join(dir, '.htaccess'), 'utf8');
    if (!htaccess.includes('admin\\.strixproduction\\.com')) fail('.htaccess does not route to admin.strixproduction.com.');
  }
};

const verifySite = async (files) => {
  const manifestPath = join(dir, 'release-manifest.json');
  if (files.includes('NOT-FOR-RELEASE.txt')) fail('Built with STRIX_PRERENDER_OFFLINE=1 (NOT-FOR-RELEASE.txt present): blogs and case studies are missing.');
  if (!existsSync(manifestPath)) {
    fail('No release-manifest.json: this folder was not produced by the current build.');
    return null;
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!manifest.complete) fail('release-manifest.json says the build is incomplete.');

  const listed = Object.keys(manifest.files);
  for (const file of listed) {
    if (!files.includes(file)) {
      fail(`${file} is in the manifest but missing from the folder.`);
      continue;
    }
    if (sha256(await readFile(join(dir, file))) !== manifest.files[file].sha256) fail(`${file} changed after the build.`);
  }
  for (const file of files) if (file !== 'release-manifest.json' && !listed.includes(file)) fail(`${file} is not part of this build (left over from an older one?).`);

  for (const required of ['index.html', 'app.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
    if (!files.includes(required)) fail(`Missing ${required}.`);
  }
  const htaccess = files.includes('.htaccess') ? await readFile(join(dir, '.htaccess'), 'utf8') : '';
  if (htaccess.includes('# @generated-route-rules')) fail('.htaccess still has the route-rules placeholder.');
  if (!/RewriteRule \^project\/\?\$ (%\{ENV:CANON\})?\/works/.test(htaccess)) fail('.htaccess lacks the legacy redirects.');

  const routes = manifest.routes || [];
  const groups = Object.groupBy ? Object.groupBy(routes, (route) => route.group) : {};
  notes.push(`routes: ${Object.entries(groups).map(([group, list]) => `${list.length} ${group}`).join(', ')}`);

  for (const route of routes) {
    const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
    if (!files.includes(file)) {
      fail(`Route ${route.path} has no ${file}.`);
      continue;
    }
    const html = await readFile(join(dir, file), 'utf8');
    const canonical = `https://www.strixproduction.com${route.path}`;
    if (count(html, /<title[ >]/g) !== 1) fail(`${file}: expected one <title>.`);
    if (count(html, /name="description"/g) !== 1) fail(`${file}: expected one meta description.`);
    if (route.noindex) {
      if (!html.includes('content="noindex, follow"')) fail(`${file}: noindex route is not marked noindex.`);
    } else if (count(html, /rel="canonical"/g) !== 1 || !html.includes(`rel="canonical" href="${canonical}"`)) {
      fail(`${file}: canonical is not ${canonical}.`);
    }
    const ogImage = /property="og:image" content="([^"]*)"/.exec(html)?.[1] || '';
    if (!/^https:\/\//.test(ogImage)) fail(`${file}: og:image is not an absolute https URL.`);
    if (count(html, /name="twitter:card"/g) !== 1) fail(`${file}: expected one twitter:card.`);
    await checkAssets(file, html);
  }

  if (files.includes('sitemap.xml')) {
    const xml = await readFile(join(dir, 'sitemap.xml'), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    if (new Set(locs).size !== locs.length) fail('sitemap.xml has duplicate URLs.');
    for (const loc of locs) {
      const path = loc.replace('https://www.strixproduction.com', '') || '/';
      const route = routes.find((entry) => entry.path === path);
      if (!loc.startsWith('https://www.strixproduction.com/')) fail(`sitemap.xml: ${loc} is not on the canonical host.`);
      else if (!route) fail(`sitemap.xml: ${loc} has no prerendered page.`);
      else if (route.noindex) fail(`sitemap.xml: ${loc} is noindex.`);
    }
    notes.push(`sitemap: ${locs.length} URLs`);
  }
  return manifest;
};

const compareMirror = async (manifest) => {
  if (!mirror) return;
  const keep = new Set([...Object.keys(manifest?.files || {}), 'release-manifest.json']);
  const serverFiles = (await listFiles(mirror)).filter((file) => !file.startsWith('admin/') && file !== 'admin');
  const stale = serverFiles.filter((file) => !keep.has(file));
  const missing = [...keep].filter((file) => !serverFiles.includes(file));
  notes.push(`compared with ${mirror}: ${stale.length} stale file(s) to delete, ${missing.length} file(s) not uploaded`);
  stale.slice(0, 200).forEach((file) => notes.push(`  stale: ${file}`));
  missing.slice(0, 50).forEach((file) => notes.push(`  missing on server: ${file}`));
};

if (!existsSync(dir)) {
  console.error(`No such folder: ${dir}`);
  process.exit(1);
}
const files = await listFiles(dir);
const manifest = admin ? await verifyAdmin(files) : await verifySite(files);
await compareMirror(manifest);

console.log(`${admin ? 'Studio' : 'Site'} release check: ${dir}`);
notes.forEach((note) => console.log(`  ${note}`));
if (problems.length) {
  console.log(`\nNOT READY (${problems.length} problem${problems.length === 1 ? '' : 's'}):`);
  problems.slice(0, 100).forEach((problem) => console.log(`  - ${problem}`));
  if (problems.length > 100) console.log(`  … and ${problems.length - 100} more`);
  process.exit(1);
}
console.log('\nREADY: every page, asset and generated file checks out.');
