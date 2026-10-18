/**
 * Pure generators for the files the production build writes next to the
 * bundle: per-route HTML heads, sitemap.xml, llms.txt, .htaccess route rules
 * and the release manifest. No I/O here, so everything is unit-tested.
 */
import { createHash } from 'node:crypto';
import {
  BRAND,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_URL,
  canonicalPath,
  cleanDescription,
  fullTitle,
  socialImage,
} from '../src/lib/seo.js';

export const ROUTE_RULES_MARKER = '# @generated-route-rules';
export const SITEMAP_LIMIT = 50000;

export const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const escapeXml = (value) => escapeHtml(value).replace(/'/g, '&apos;');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @typedef {Object} Route
 * @property {string} path canonical path
 * @property {string} title
 * @property {string} [description]
 * @property {'website' | 'article'} [type]
 * @property {string} [image]
 * @property {string} [imageAlt]
 * @property {boolean} [noindex]
 * @property {string} [lastmod] YYYY-MM-DD
 * @property {'page' | 'service' | 'blog' | 'case-study'} [group]
 */

/** Head tags for one route, each marked with the route's canonical path. */
export const headTags = (route) => {
  const path = canonicalPath(route.path);
  const marker = `data-prerender="${escapeHtml(path)}"`;
  const title = escapeHtml(fullTitle(route.title));
  const description = escapeHtml(cleanDescription(route.description));
  const url = escapeHtml(`${SITE_URL}${path}`);
  const image = socialImage(route.image);
  const imageAlt = escapeHtml(image === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : route.imageAlt || fullTitle(route.title));
  return [
    `<title ${marker}>${title}</title>`,
    `<meta ${marker} name="description" content="${description}" />`,
    route.noindex ? `<meta ${marker} name="robots" content="noindex, follow" />` : `<link ${marker} rel="canonical" href="${url}" />`,
    `<meta ${marker} property="og:site_name" content="${escapeHtml(BRAND)}" />`,
    `<meta ${marker} property="og:title" content="${title}" />`,
    `<meta ${marker} property="og:description" content="${description}" />`,
    `<meta ${marker} property="og:url" content="${url}" />`,
    `<meta ${marker} property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" />`,
    `<meta ${marker} property="og:image" content="${escapeHtml(image)}" />`,
    `<meta ${marker} property="og:image:alt" content="${imageAlt}" />`,
    `<meta ${marker} name="twitter:card" content="summary_large_image" />`,
    `<meta ${marker} name="twitter:title" content="${title}" />`,
    `<meta ${marker} name="twitter:description" content="${description}" />`,
    `<meta ${marker} name="twitter:image" content="${escapeHtml(image)}" />`,
  ].join('\n    ');
};

const TITLE_SLOT = /<title data-prerender>[^<]*<\/title>/;

/** The built index.html with its placeholder title replaced by a route's head. */
export const renderPage = (shell, route) => {
  if (!TITLE_SLOT.test(shell)) throw new Error('index.html has no <title data-prerender> placeholder to replace.');
  return shell.replace(TITLE_SLOT, () => headTags(route));
};

/**
 * Generic head for URLs without a prerendered page (new CMS content until the
 * next build). The empty marker never matches a route, so pages replace it.
 */
export const renderShell = (shell, { title, description, noindex = false }) =>
  shell.replace(TITLE_SLOT, () =>
    [
      `<title data-prerender="">${escapeHtml(fullTitle(title))}</title>`,
      `<meta data-prerender="" name="description" content="${escapeHtml(cleanDescription(description))}" />`,
      noindex && '<meta data-prerender="" name="robots" content="noindex, follow" />',
      `<meta data-prerender="" property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
      '<meta data-prerender="" name="twitter:card" content="summary_large_image" />',
    ]
      .filter(Boolean)
      .join('\n    ')
  );

/** Prerendered file for a route, relative to the output directory. */
export const routeFile = (path) => (canonicalPath(path) === '/' ? 'index.html' : `${canonicalPath(path).slice(1)}.html`);

export const indexableRoutes = (routes) => routes.filter((route) => !route.noindex);

/** @param {Route[]} routes */
export const sitemapXml = (routes) => {
  const seen = new Set();
  const entries = indexableRoutes(routes).filter((route) => {
    const path = canonicalPath(route.path);
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
  if (entries.length > SITEMAP_LIMIT) throw new Error(`Sitemap has ${entries.length} URLs; split it into a sitemap index.`);
  const urls = entries.map((route) => {
    const loc = `<loc>${escapeXml(`${SITE_URL}${canonicalPath(route.path)}`)}</loc>`;
    const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(route.lastmod || '') ? `<lastmod>${route.lastmod}</lastmod>` : '';
    return `  <url>${loc}${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
};

const GROUP_HEADINGS = [
  ['page', 'Pages'],
  ['service', 'Services'],
  ['case-study', 'Case studies'],
  ['blog', 'Blog'],
];

/** A short curated index for LLM crawlers (https://llmstxt.org). */
export const llmsTxt = (routes) => {
  const indexable = indexableRoutes(routes);
  const sections = GROUP_HEADINGS.map(([group, heading]) => {
    const items = indexable
      .filter((route) => (route.group || 'page') === group)
      .map((route) => `- [${route.title.replace(/[[\]]/g, '')}](${SITE_URL}${canonicalPath(route.path)}): ${cleanDescription(route.description)}`);
    return items.length ? `## ${heading}\n\n${items.join('\n')}\n` : '';
  }).filter(Boolean);
  return [
    `# ${BRAND}`,
    '',
    '> Design, development and production studio for startups, SaaS and technology teams: UI/UX and brand design, websites, web and mobile apps, MVPs, and video production.',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    ...sections,
  ].join('\n');
};

/**
 * Apache rules for legacy redirects and canonical-case redirects of known
 * routes, inserted at the marker in public/.htaccess.
 * @param {{ legacy: Record<string, string>, paths: string[] }} input
 */
export const htaccessRouteRules = ({ legacy, paths }) => {
  const lines = ['# Obsolete URLs (src/data/legacyRoutes.js)'];
  for (const [from, to] of Object.entries(legacy)) {
    lines.push(`RewriteRule ^${escapeRegex(from.slice(1))}/?$ %{ENV:CANON}${to} [NC,R=301,L]`);
  }
  lines.push('', '# Known pages answer only at their lower-case address');
  for (const path of [...new Set(paths.map(canonicalPath))].filter((path) => path !== '/' && /[a-z]/.test(path)).sort()) {
    lines.push(`RewriteCond %{REQUEST_URI} !^${escapeRegex(path)}$`);
    lines.push(`RewriteRule ^${escapeRegex(path.slice(1))}$ %{ENV:CANON}${path} [NC,R=301,L]`);
  }
  return lines.join('\n');
};

export const fillHtaccess = (template, rules) => {
  const lines = template.split('\n');
  const index = lines.findIndex((line) => line.trim() === ROUTE_RULES_MARKER);
  if (index === -1) throw new Error(`.htaccess has no "${ROUTE_RULES_MARKER}" line for the generated rules.`);
  lines.splice(index, 1, rules);
  return lines.join('\n');
};

export const sha256 = (content) => createHash('sha256').update(content).digest('hex');

/**
 * @param {Array<{ path: string, content: Buffer | string }>} files
 * @param {{ routes: Route[], complete: boolean, builtAt: string }} info
 */
export const releaseManifest = (files, { routes, complete, builtAt }) => ({
  complete,
  builtAt,
  routes: routes.map((route) => ({ path: canonicalPath(route.path), group: route.group || 'page', noindex: Boolean(route.noindex) })),
  files: Object.fromEntries(
    files
      .slice()
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((file) => [file.path, { sha256: sha256(file.content), bytes: Buffer.byteLength(file.content) }])
  ),
});

/**
 * Pages the previous release served that this build no longer generates.
 * @param {{ routes?: Array<{ path: string, group?: string }> } | null} previous
 * @param {Route[]} routes
 */
export const droppedRoutes = (previous, routes) => {
  const current = new Set(routes.map((route) => canonicalPath(route.path)));
  return (previous?.routes || []).filter((route) => !current.has(route.path));
};

/**
 * A content group that had pages last release and has none now is almost
 * always a failed read, not a deliberate unpublish of everything.
 */
export const emptiedGroups = (previous, routes, groups = ['blog', 'case-study']) =>
  groups.filter(
    (group) =>
      (previous?.routes || []).some((route) => route.group === group) && !routes.some((route) => route.group === group)
  );
