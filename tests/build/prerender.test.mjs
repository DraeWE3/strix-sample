/**
 * Real production builds with networking cut off (Linux `unshare -rn`):
 * a Neon outage must fail the build and leave the previous output as it
 * was, and an explicitly offline build must be refused by the release check.
 *
 * Slow (two builds). Run with: npm run test:build
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const canIsolate = spawnSync('unshare', ['-rn', 'true']).status === 0;

const offlineBuild = (outDir, env = {}) =>
  spawnSync('unshare', ['-rn', 'npx', 'vite', 'build', '--outDir', outDir], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout: 300000,
  });

const snapshot = async (dir) => {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath ?? entry.path, entry.name)).sort();
  return Promise.all(files.map(async (file) => [file, await readFile(file, 'utf8')]));
};

test('a build that cannot reach Neon fails and keeps the previous release intact', { skip: !canIsolate && 'unshare -rn is not available' }, async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'strix-build-'));
  await mkdir(join(outDir, 'blog'), { recursive: true });
  await writeFile(join(outDir, 'blog', 'kept.html'), '<title>previous release</title>');
  await writeFile(join(outDir, 'release-manifest.json'), JSON.stringify({ complete: true, routes: [{ path: '/blog/kept', group: 'blog' }], files: {} }));
  const before = await snapshot(outDir);

  const result = offlineBuild(outDir);
  assert.notEqual(result.status, 0, 'the build must fail');
  assert.match(result.stdout + result.stderr, /Could not read published blogs and case studies from Neon/);
  assert.deepEqual(await snapshot(outDir), before, 'previous output untouched');
});

test('STRIX_PRERENDER_OFFLINE=1 builds, but marks the output as not releasable', { skip: !canIsolate && 'unshare -rn is not available' }, async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'strix-build-'));
  const result = offlineBuild(outDir, { STRIX_PRERENDER_OFFLINE: '1' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(join(outDir, 'NOT-FOR-RELEASE.txt')));
  assert.ok(!existsSync(join(outDir, 'sitemap.xml')), 'no partial sitemap is published');
  assert.ok(existsSync(join(outDir, 'services', 'ui-ux-design.html')), 'static pages are still prerendered');
  const manifest = JSON.parse(await readFile(join(outDir, 'release-manifest.json'), 'utf8'));
  assert.equal(manifest.complete, false);

  const verify = spawnSync('node', ['scripts/verify-release.mjs', outDir], { cwd: root, encoding: 'utf8' });
  assert.equal(verify.status, 1);
  assert.match(verify.stdout, /NOT READY/);
});
