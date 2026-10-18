/**
 * URL and metadata rules shared by the <SEO> component, the prerender build
 * and the generated sitemap, so every place agrees on one canonical address.
 */
export const SITE_URL = 'https://www.strixproduction.com';
export const BRAND = 'Strix Production';
export const DEFAULT_DESCRIPTION =
  'Strix Production - Premium Digital Design & Development Agency. We build MVPs, SaaS products, and high-end websites.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const DEFAULT_OG_IMAGE_ALT = 'Strix Production — Where Creative Strategy Meets Scalable Technology';

// Dynamic segments are Firestore ids or slugs and keep their case.
const CASE_SENSITIVE = /^\/(blog|case-study)\/([^/]+)$/i;

/**
 * Lower-case, single slashes, no trailing slash (except the home page).
 * @param {string} pathname
 */
export const canonicalPath = (pathname) => {
  const path = String(pathname || '/').split(/[?#]/)[0].replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
  const dynamic = CASE_SENSITIVE.exec(path);
  if (dynamic) return `/${dynamic[1].toLowerCase()}/${dynamic[2]}`;
  return path.toLowerCase();
};

/** @param {string} pathname */
export const canonicalUrl = (pathname) => `${SITE_URL}${canonicalPath(pathname)}`;

export const fullTitle = (title) => (title ? `${title} | ${BRAND}` : BRAND);

const hasUnsafeChars = (value) => [...value].some((char) => char.charCodeAt(0) < 32 || char === '\u007f' || char === '\\');

/**
 * Social cards need an absolute https URL; `data:` URIs and relative paths
 * fall back to the default share image.
 * @param {unknown} value
 */
export const socialImage = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw || hasUnsafeChars(raw)) return DEFAULT_OG_IMAGE;
  if (raw.startsWith('/') && !raw.startsWith('//')) return `${SITE_URL}${raw}`;
  if (!/^https:\/\//i.test(raw)) return DEFAULT_OG_IMAGE;
  try {
    const url = new URL(raw);
    return url.username || url.password ? DEFAULT_OG_IMAGE : url.href;
  } catch {
    return DEFAULT_OG_IMAGE;
  }
};

export const cleanDescription = (value, fallback = DEFAULT_DESCRIPTION) =>
  (typeof value === 'string' && value.replace(/\s+/g, ' ').trim()) || fallback;
