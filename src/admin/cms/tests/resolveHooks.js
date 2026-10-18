/*
 * Lets Node load the site's Vite-style modules in tests: extensionless
 * relative imports, and `import.meta.env` (empty unless a test sets
 * globalThis.__STRIX_TEST_ENV__).
 */
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
}
export async function load(url, context, next) {
  const result = await next(url, context);
  if (!url.startsWith('file:') || !/\\/src\\/.*\\.jsx?$/.test(url) || result.format !== 'module') return result;
  const source = String(result.source);
  if (!source.includes('import.meta.env')) return result;
  return { ...result, source: source.replaceAll('import.meta.env', '(globalThis.__STRIX_TEST_ENV__ ?? {})') };
}`),
    import.meta.url,
  );
}
