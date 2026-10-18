/**
 * Obsolete URLs and their current pages. Drives the 301s generated into
 * .htaccess, the in-app redirects in App.jsx and sitemap exclusion.
 * Keys are canonical (lower-case, no trailing slash) paths.
 */
export const LEGACY_REDIRECTS = Object.freeze({
  '/project': '/works',
  '/home': '/',
  '/uiux': '/services/ui-ux-design',
  '/appdesign': '/services/ui-ux-design',
  '/webdesign': '/services/ui-ux-design',
  '/product': '/services/product-design',
  '/branding': '/services/branding',
  '/cdesign': '/services/creative-design',
  '/webapp': '/services/web-app',
  '/appdev': '/services/app-dev',
  '/intaweb': '/services/interactive-web',
  '/webdev': '/services/web-dev',
  '/softwaredev': '/services/software-dev',
  '/commercials': '/services/commercials',
  '/longform': '/services/long-format',
  '/reel': '/services/reels-shorts',
  '/motion': '/services/motion-graphics',
  '/threed': '/services/3d-animations',
  '/url': '/',
});

/** @param {string} canonical a canonicalPath() result */
export const legacyRedirect = (canonical) =>
  Object.hasOwn(LEGACY_REDIRECTS, canonical) ? LEGACY_REDIRECTS[canonical] : null;
