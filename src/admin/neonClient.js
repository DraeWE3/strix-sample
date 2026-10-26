import { createClient } from '@neondatabase/neon-js';

/**
 * The studio's Neon client: Neon Auth sign-in plus the Data API, which sends
 * the signed-in user's token so row-level security grants admins full access.
 */
export const neonAdmin = createClient({
  auth: { url: import.meta.env.VITE_NEON_AUTH_URL },
  dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});
