/* Lets Node load the site's Vite-style extensionless relative imports in tests. */
import { register } from 'node:module';

if (!globalThis.__strixResolveHooks) {
  globalThis.__strixResolveHooks = true;
  register(
    'data:text/javascript,' +
      encodeURIComponent(`export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (error) {
    if (error && error.code === 'ERR_MODULE_NOT_FOUND' && /^\\.\\.?\\//.test(specifier) && !/\\.[a-z]+$/i.test(specifier)) return next(specifier + '.js', context);
    throw error;
  }
}`),
    import.meta.url,
  );
}
