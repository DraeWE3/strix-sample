const asString = (value) => (typeof value === 'string' ? value : '');

const hasUnsafeChars = (value) => [...value].some((char) => char.charCodeAt(0) < 32 || char === '\u007f' || char === '\\');

const BASE64_IMAGE = /^data:image\/(?:png|jpeg|jpg|gif|webp|avif|svg\+xml);base64,[a-z0-9+/=]+$/i;

/**
 * Accepts https URLs, site-relative paths and (with `allowData`) base64
 * image data URIs. Everything else, including `javascript:`, `http:`,
 * and protocol-relative URLs, becomes ''.
 * @param {unknown} value
 * @param {{ allowData?: boolean }} [options]
 * @returns {string}
 */
export const safeUrl = (value, { allowData = true } = {}) => {
  const raw = asString(value).trim();
  if (!raw || hasUnsafeChars(raw)) return '';
  if (BASE64_IMAGE.test(raw)) return allowData ? raw : '';
  if (/^https:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.username || url.password ? '' : url.href;
    } catch {
      return '';
    }
  }
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '';
};

/**
 * An absolute http(s) URL without credentials, for links that leave the site.
 * @param {unknown} value
 */
export const safeExternalUrl = (value) => {
  const raw = asString(value).trim();
  if (!/^https?:\/\//i.test(raw) || hasUnsafeChars(raw)) return '';
  try {
    const url = new URL(raw);
    return url.username || url.password ? '' : url.href;
  } catch {
    return '';
  }
};
