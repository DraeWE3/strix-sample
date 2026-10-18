/**
 * Canonical URLs, social images, legacy redirects and the build's generated
 * files (heads, sitemap, llms.txt, .htaccess rules, release checks).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { canonicalPath, canonicalUrl, socialImage, DEFAULT_OG_IMAGE } from '../src/lib/seo.js';
import { LEGACY_REDIRECTS, legacyRedirect } from '../src/data/legacyRoutes.js';
import {
  droppedRoutes,
  emptiedGroups,
  fillHtaccess,
  headTags,
  htaccessRouteRules,
  llmsTxt,
  releaseManifest,
  renderPage,
  routeFile,
  sitemapXml,
} from '../build/seoArtifacts.js';

const SHELL = '<html><head><title data-prerender>Strix Production</title></head><body></body></html>';

test('canonical paths are lower-case without trailing slashes, except dynamic ids', () => {
  assert.equal(canonicalPath('/Works/'), '/works');
  assert.equal(canonicalPath('/Services/UI-UX-Design'), '/services/ui-ux-design');
  assert.equal(canonicalPath('/'), '/');
  assert.equal(canonicalPath(''), '/');
  assert.equal(canonicalPath('//about//'), '/about');
  assert.equal(canonicalPath('/Blog/AbC123'), '/blog/AbC123');
  assert.equal(canonicalPath('/case-study/Wurkzen/'), '/case-study/Wurkzen');
  assert.equal(canonicalPath('/works?x=1#top'), '/works');
  assert.equal(canonicalUrl('/'), 'https://www.strixproduction.com/');
});

test('social images are absolute https URLs; data: and relative paths fall back', () => {
  assert.equal(socialImage(''), DEFAULT_OG_IMAGE);
  assert.equal(socialImage('data:image/png;base64,AAAA'), DEFAULT_OG_IMAGE);
  assert.equal(socialImage('./src/assets/img/brand/link.webp'), DEFAULT_OG_IMAGE);
  assert.equal(socialImage('http://insecure.example/a.jpg'), DEFAULT_OG_IMAGE);
  assert.equal(socialImage('/og-default.jpg'), 'https://www.strixproduction.com/og-default.jpg');
  assert.equal(socialImage('https://res.cloudinary.com/x/a.jpg'), 'https://res.cloudinary.com/x/a.jpg');
});

test('every legacy URL redirects to a page that exists', async () => {
  const { serviceSlugs } = await import('../src/data/serviceDetails.js').catch(() => ({ serviceSlugs: null }));
  const pageMeta = await readFile(new URL('../src/data/pageMeta.js', import.meta.url), 'utf8');
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    assert.equal(from, canonicalPath(from), `${from} is a canonical key`);
    assert.ok(!pageMeta.includes(`"${from}":`), `${from} is not also a prerendered page`);
    if (to.startsWith('/services/') && serviceSlugs) assert.ok(serviceSlugs.includes(to.slice(10)), `${to} is a real service`);
  }
  assert.equal(legacyRedirect('/project'), '/works');
  assert.equal(legacyRedirect('/constructor'), null, 'no prototype keys');
  assert.equal(legacyRedirect('/ecommerce'), null, '/ecommerce stays a live page');
});

test('a prerendered head has exactly one of each tag, with https social tags', () => {
  const html = renderPage(SHELL, { path: '/Works/', title: 'Works & "Portfolio"', description: 'A <b>list</b>', image: 'data:image/png;base64,AAAA' });
  const count = (pattern) => (html.match(pattern) || []).length;
  assert.equal(count(/<title /g), 1);
  assert.equal(count(/name="description"/g), 1);
  assert.equal(count(/rel="canonical" href="https:\/\/www\.strixproduction\.com\/works"/g), 1);
  assert.equal(count(/property="og:image" content="https:\/\/www\.strixproduction\.com\/og-default\.jpg"/g), 1);
  assert.equal(count(/name="twitter:card" content="summary_large_image"/g), 1);
  assert.equal(count(/property="twitter:/g), 0, 'twitter tags use name=');
  assert.ok(html.includes('Works &amp; &quot;Portfolio&quot; | Strix Production'));
  assert.ok(html.includes('A &lt;b&gt;list&lt;/b&gt;'));
  assert.ok(html.includes('data-prerender="/works"'));
});

test('noindex routes have no canonical and are left out of the sitemap and llms.txt', () => {
  const tags = headTags({ path: '/cs', title: 'Coming Soon', noindex: true });
  assert.ok(tags.includes('noindex'));
  assert.ok(!tags.includes('rel="canonical"'));
  const routes = [
    { path: '/', title: 'Home', group: 'page' },
    { path: '/cs', title: 'Coming soon', noindex: true },
    { path: '/services/web-dev', title: 'Web', group: 'service' },
    { path: '/services/web-dev/', title: 'Duplicate', group: 'service' },
    { path: '/blog/Ab1', title: 'Post', group: 'blog', lastmod: '2026-10-01' },
  ];
  const xml = sitemapXml(routes);
  assert.equal((xml.match(/<url>/g) || []).length, 3);
  assert.ok(xml.includes('<loc>https://www.strixproduction.com/</loc>'));
  assert.ok(xml.includes('<loc>https://www.strixproduction.com/blog/Ab1</loc><lastmod>2026-10-01</lastmod>'));
  assert.ok(!xml.includes('/cs<'));
  const llms = llmsTxt(routes);
  assert.ok(llms.includes('## Services'));
  assert.ok(!llms.includes('/cs)'));
});

test('route files map clean URLs to .html files', () => {
  assert.equal(routeFile('/'), 'index.html');
  assert.equal(routeFile('/services/web-dev'), 'services/web-dev.html');
  assert.equal(routeFile('/Works/'), 'works.html');
});

test('.htaccess gets legacy 301s and lower-case redirects at the marker', async () => {
  const rules = htaccessRouteRules({ legacy: { '/project': '/works', '/uiux': '/services/ui-ux-design' }, paths: ['/', '/works', '/services/web-dev'] });
  assert.ok(rules.includes('RewriteRule ^project/?$ %{ENV:CANON}/works [NC,R=301,L]'));
  assert.ok(rules.includes('RewriteCond %{REQUEST_URI} !^/works$\nRewriteRule ^works$ %{ENV:CANON}/works [NC,R=301,L]'));
  assert.ok(rules.includes('RewriteRule ^services/web-dev$ %{ENV:CANON}/services/web-dev [NC,R=301,L]'));
  const template = await readFile(new URL('../public/.htaccess', import.meta.url), 'utf8');
  const filled = fillHtaccess(template, rules);
  assert.ok(!filled.includes('# @generated-route-rules'));
  assert.ok(filled.indexOf('^project/?$') < filled.indexOf('RewriteRule ^(.+)/$'), 'redirects run before the trailing-slash rule');
  assert.ok(filled.indexOf('^project/?$') < filled.indexOf('RewriteRule ^ app.html') || !filled.includes('RewriteRule ^ app.html'));
  assert.throws(() => fillHtaccess('RewriteEngine On', rules), /generated-route-rules/);
});

test('the release manifest and content-drop checks catch a silently emptied build', () => {
  const previous = { routes: [{ path: '/blog/a', group: 'blog' }, { path: '/case-study/x', group: 'case-study' }, { path: '/works', group: 'page' }] };
  const routes = [{ path: '/works', group: 'page' }];
  assert.deepEqual(emptiedGroups(previous, routes), ['blog', 'case-study']);
  assert.deepEqual(droppedRoutes(previous, routes).map((r) => r.path), ['/blog/a', '/case-study/x']);
  assert.deepEqual(emptiedGroups(null, routes), [], 'a first build has nothing to compare with');
  const manifest = releaseManifest([{ path: 'b.txt', content: 'b' }, { path: 'a.txt', content: 'a' }], { routes, complete: true, builtAt: 'now' });
  assert.deepEqual(Object.keys(manifest.files), ['a.txt', 'b.txt']);
  assert.equal(manifest.files['a.txt'].sha256, 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb');
});
