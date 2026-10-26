import { NeonPostgrestClient, fetchWithToken } from '@neondatabase/postgrest-js';

export const neonConfig = {
  dataApiUrl: import.meta.env.VITE_NEON_DATA_API_URL,
  authUrl: import.meta.env.VITE_NEON_AUTH_URL,
};

const EXPIRY_MARGIN_MS = 30 * 1000;

// Neon Auth reports expiry in epoch seconds; accept milliseconds too.
const toMs = (value) => (value < 1e12 ? value * 1000 : value);

/**
 * Visitors read with Neon Auth's anonymous token, which the Data API maps to
 * the `anonymous` Postgres role: row-level security then shows published rows only.
 * The token is cached until shortly before it expires.
 * @param {string} authUrl
 */
export const createAnonymousTokenSource = (authUrl, request = (...args) => fetch(...args)) => {
  let pending = null;
  let cached = null;
  const refresh = async () => {
    const response = await request(`${authUrl.replace(/\/+$/, '')}/token/anonymous`);
    if (!response.ok) {
      throw Object.assign(new Error(`Neon Auth did not issue a visitor token (HTTP ${response.status}).`), { code: 'unavailable' });
    }
    const { token, expires_at: expiresAt } = await response.json();
    cached = { token, expiresAt: Number.isFinite(expiresAt) ? toMs(expiresAt) : Date.now() + 60 * 1000 };
    return token;
  };
  return () => {
    if (cached && Date.now() < cached.expiresAt - EXPIRY_MARGIN_MS) return Promise.resolve(cached.token);
    pending ??= refresh().finally(() => {
      pending = null;
    });
    return pending;
  };
};

/** @param {{ dataApiUrl?: string, authUrl?: string }} config */
export const createNeonReader = ({ dataApiUrl, authUrl } = neonConfig) => {
  if (!dataApiUrl || !authUrl) throw new Error('VITE_NEON_DATA_API_URL / VITE_NEON_AUTH_URL are not set (check .env).');
  return new NeonPostgrestClient({
    dataApiUrl,
    options: { global: { fetch: fetchWithToken(createAnonymousTokenSource(authUrl)) } },
  });
};

let reader = null;

/** The site's shared read-only Data API client, created on first use. */
export const neon = () => (reader ??= createNeonReader());

const errorCode = (error, status) => {
  if (status === 401) return 'unauthenticated';
  if (status === 403 || error.code === '42501') return 'permission-denied';
  if (!status || status >= 500) return 'unavailable';
  return error.code || 'error';
};

/**
 * Awaits a Data API query and returns its rows, turning an `{ error }` answer
 * into a thrown Error with a `code` (`unavailable`, `permission-denied`, …).
 * @template T
 * @param {PromiseLike<{ data: T, error: any, status?: number }>} query
 * @returns {Promise<T>}
 */
export const run = async (query) => {
  const { data, error, status } = await query;
  if (error) {
    throw Object.assign(new Error(error.message || 'The database request failed.'), { code: errorCode(error, status), cause: error });
  }
  return data;
};
