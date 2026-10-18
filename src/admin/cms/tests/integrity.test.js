/**
 * Admin gating, unsafe data and partial-failure behaviour of the studio backend.
 *
 * Run from strix-sample/: npm test
 */
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createFakeFirebase } from './fakeFirebase.js';

const fake = createFakeFirebase({
  accounts: { 'admin@strix.test': 'pw-admin', 'intruder@strix.test': 'pw-intruder', 'claimed@strix.test': 'pw-claimed' },
  admins: ['admin@strix.test'],
});
mock.module('firebase/firestore', { namedExports: fake.firestore });
mock.module('firebase/auth', { namedExports: { ...fake.auth, getAuth: () => ({}) } });
mock.module(new URL('../../firebaseconfig.js', import.meta.url).href, { namedExports: { auth: {}, db: {} } });
mock.module(new URL('../../../lib/firebase.js', import.meta.url).href, { namedExports: { app: {}, db: {} } });
mock.module(new URL('../../storage.js', import.meta.url).href, { namedExports: fake.storage });

const { createBackend } = await import('../backend.js');
const { reconstructSectionData } = await import('../../../lib/caseStudies.js');

const T0 = '2025-01-01T00:00:00.000Z';
const card = (overrides) => ({
  title: 'Card', categoryText: 'UI/UX', industry: '', image: 'https://res.cloudinary.com/x/card.jpg', link: '/case-study/card',
  externalLink: '', filters: { Design: ['UI/UX'], Development: [], Production: [], MVP: [] }, status: 'published', createdAt: T0, updatedAt: T0,
  ...overrides,
});

fake.seed('projects/p1', card({ title: 'Aurora', link: '/case-study/aurora' }));
fake.seed('caseStudies/c1', {
  projectId: 'p1', projectTitle: 'Aurora AI', heroVideo: 'https://cdn.example.com/hero.mp4', heroThumbnail: '',
  client: { name: 'Aurora', logo: '', industry: 'AI', country: 'India', services: 'UI/UX' },
  aboutProject: { description: 'Story', experienceLink: 'http://legacy.example', images: [] },
  conceptSlides: Array(9).fill(''), responsiveImages: Array(8).fill(''),
  technologies: { design: [], development: [], production: [] }, results: [], status: 'published', createdAt: T0, updatedAt: T0,
});
fake.seed('caseStudies/c2', { projectId: 'p1', projectTitle: 'Aurora duplicate', status: 'draft', createdAt: T0, updatedAt: T0 });
fake.seed('caseStudies/c2/chunks/x1', { sectionName: 'hero_thumbnail', data: { heroThumbnail: 'https://x/1.jpg' }, createdAt: T0 });
fake.seed('projects/p2', card({ title: 'Evil link', link: 'javascript:alert(1)', externalLink: 'javascript:alert(2)' }));
fake.seed('projects/p3', card({ title: 'Plain http', link: '/case-study/plain', externalLink: 'http://insecure.example' }));
fake.seed('projects/a"><img src=x onerror=alert(1)>', card({ title: 'Crafted id' }));
fake.seed('blogs/b1', { headerText: 'Post', topic: 'Post', tag: 'Tips', date: '2025-02-01', content: [], status: 'draft', createdAt: T0, updatedAt: T0 });
// A project the studio has not loaded yet (created elsewhere after the list was opened).
const lateSlug = '/case-study/taken-later';

const backend = createBackend();
const api = backend.api;
const login = (email, password) => api('/api/login', { method: 'POST', body: { email, password } });
const open = (id) => api(`/api/content/${id}`);
const save = (record) => api(`/api/content/${record.id}`, { method: 'PUT', body: { data: record.data } });
const rejects = async (promise, status, pattern) => {
  const error = await promise.then(() => null, (e) => e);
  assert.ok(error, 'expected the call to fail');
  assert.equal(error.status, status, error.message);
  if (pattern) assert.match(error.message, pattern);
  return error;
};
const snapshotDb = () => JSON.stringify([...fake.docs.entries()].sort());

test('accounts that are not admins are signed out and refused', async () => {
  await rejects(login('intruder@strix.test', 'pw-intruder'), 403, /not a studio administrator/);
  const session = await api('/api/session');
  assert.equal(session.authenticated, false);
  await rejects(api('/api/content'), 401);
});

test('an admin custom claim is accepted without an admins document', async () => {
  fake.setClaims('uid-claimed@strix.test', { admin: true });
  const session = await login('claimed@strix.test', 'pw-claimed');
  assert.equal(session.authenticated, true);
  await api('/api/logout', { method: 'POST', body: {} });
});

test('an unreadable admins document counts as not an admin', async () => {
  fake.setRules(({ op, path }) => !(op === 'read' && path.startsWith('admins/')));
  try {
    await rejects(login('admin@strix.test', 'pw-admin'), 403);
  } finally {
    fake.setRules(() => true);
  }
});

test('documents with unsafe ids are not listed and links never use unsafe schemes', async () => {
  await login('admin@strix.test', 'pw-admin');
  const { items } = await api('/api/content');
  assert.ok(items.every((item) => /^[A-Za-z0-9_-]+$/.test(item.id)), 'every listed id is markup-safe');
  assert.ok(!items.some((item) => item.data.title === 'Crafted id'));
  const evil = items.find((item) => item.data.title === 'Evil link');
  assert.equal(evil.liveUrl, '/case-study/p2');
  const http = items.find((item) => item.data.title === 'Plain http');
  assert.equal(http.liveUrl, '/case-study/plain', 'only https external links are used');
});

test('an unsafe stored link is never written back, and publishing asks for a slug', async () => {
  const record = await open('p_p2');
  assert.equal(record.data.slug, '');
  record.data.title = 'Renamed';
  const mark = fake.writes.length;
  await save(record);
  const cardWrite = fake.writes.slice(mark).find((w) => w.path === 'projects/p2');
  assert.deepEqual(Object.keys(cardWrite.data).sort(), ['title', 'updatedAt'], 'the link is not rewritten');

  const error = await rejects(api('/api/content/p_p2/publish', { method: 'POST', body: {} }), 422);
  assert.ok(error.fields.some((field) => field.field === 'data.slug'));

  const fixed = await open('p_p2');
  fixed.data.slug = 'evil-link-fixed';
  await save(fixed);
  assert.equal(fake.get('projects/p2').link, '/case-study/evil-link-fixed');
});

test('validation of a field the editor changed still applies', async () => {
  const record = await open('p_p2');
  record.data.slug = 'Not A Slug';
  const error = await rejects(save(record), 422);
  assert.ok(error.fields.some((field) => field.field === 'data.slug'));
});

test('legacy video heroes load as video files, and unrelated legacy values do not block saving', async () => {
  const record = await open('p_p1');
  assert.equal(record.data.media.type, 'video');
  assert.equal(record.data.media.videoUrl, 'https://cdn.example.com/hero.mp4');
  record.data.title = 'Aurora Labs';
  await save(record);
  assert.equal(fake.get('projects/p1').title, 'Aurora Labs');
  assert.equal(fake.get('caseStudies/c1').heroVideo, 'https://cdn.example.com/hero.mp4', 'the stored video is kept');

  const again = await open('p_p1');
  again.data.experienceUrl = 'http://still-not-https.example';
  await rejects(save(again), 422, /highlighted/);
});

test('a failed save writes nothing, and the retry leaves no stray chunks', async () => {
  const record = await open('p_p1');
  record.data.media.type = 'image';
  record.data.media.thumbnail = `data:image/png;base64,${'Q'.repeat(200000)}`;
  record.data.about = 'New story';
  const before = snapshotDb();
  fake.failWrites(1);
  await rejects(save(record), 500, /Nothing was saved/);
  assert.equal(snapshotDb(), before, 'the transaction left the database untouched');

  const saved = await save(record);
  const chunks = [...fake.docs.keys()].filter((path) => path.startsWith('caseStudies/c1/chunks/'));
  assert.equal(chunks.length, 1, 'exactly one hero chunk after the retry');
  assert.equal(saved.data.media.thumbnail, record.data.media.thumbnail);
  assert.equal(fake.get('caseStudies/c1').aboutProject.description, 'New story');
});

test('a stray chunk from an older failed save is removed and can never override the saved image', async () => {
  fake.seed('caseStudies/c1/chunks/zzz-stray', { sectionName: 'hero_thumbnail', data: { heroThumbnail: 'https://stray/old.jpg' }, createdAt: '2000-01-01T00:00:00.000Z' });
  const main = fake.get('caseStudies/c1');
  const chunks = [...fake.docs.entries()].filter(([path]) => path.startsWith('caseStudies/c1/chunks/')).map(([path, data]) => ({ id: path.split('/').pop(), ...data }));
  assert.notEqual(reconstructSectionData(main, chunks).heroThumbnail, 'https://stray/old.jpg', 'newest chunk wins regardless of id order');

  const record = await open('p_p1');
  record.data.media.thumbnail = 'https://res.cloudinary.com/x/hero.jpg';
  await save(record);
  assert.equal(fake.get('caseStudies/c1/chunks/zzz-stray'), undefined, 'stale chunks are found on the server at save time');
  assert.equal(fake.get('caseStudies/c1').heroThumbnail, 'https://res.cloudinary.com/x/hero.jpg');
});

test('retrying a failed create reuses the same ids instead of duplicating', async () => {
  const draft = await api('/api/content', { method: 'POST', body: { kind: 'project', data: { template: 'mvp' } } });
  draft.data.title = 'Retry me';
  draft.data.slug = 'retry-me';
  draft.data.about = 'Has a story, so a case study is created too.';
  fake.failWrites(1);
  await rejects(save(draft), 500);
  assert.equal([...fake.docs.values()].filter((data) => data.title === 'Retry me').length, 0);

  const saved = await save(draft);
  const projects = [...fake.docs.entries()].filter(([path, data]) => /^projects\/[^/]+$/.test(path) && data.title === 'Retry me');
  assert.equal(projects.length, 1, 'one project document');
  const projectId = saved.id.slice(2);
  const cases = [...fake.docs.entries()].filter(([path, data]) => /^caseStudies\/[^/]+$/.test(path) && data.projectId === projectId);
  assert.equal(cases.length, 1, 'one case study document');
});

test('a second save of the same record while one is running is refused', async () => {
  const record = await open('a_b1');
  record.data.excerpt = 'First';
  const first = save(record);
  const second = save(record);
  const [a, b] = await Promise.allSettled([first, second]);
  assert.equal(a.status, 'fulfilled');
  assert.equal(b.status, 'rejected');
  assert.equal(b.reason.status, 409);
});

test('slugs are checked on the server, not only against records open in the tab', async () => {
  fake.seed('projects/late', card({ title: 'Late', link: lateSlug, status: 'draft' }));
  const record = await open('p_p3');
  record.data.slug = 'taken-later';
  const error = await rejects(save(record), 422);
  assert.ok(error.fields.some((field) => /already uses/.test(field.message)));
});

test('publishing is atomic and refuses to overwrite a concurrent edit', async () => {
  await api('/api/content');
  const before = snapshotDb();
  fake.failWrites(1);
  await rejects(api('/api/content/p_p1/unpublish', { method: 'POST', body: {} }), 500);
  assert.equal(snapshotDb(), before, 'neither the card nor the case study changed');

  fake.seed('caseStudies/c1', { ...fake.get('caseStudies/c1'), updatedAt: '2031-01-01T00:00:00.000Z' });
  await rejects(api('/api/content/p_p1/unpublish', { method: 'POST', body: {} }), 409, /changed elsewhere/);
  assert.equal(fake.get('projects/p1').status, 'published');
});

test('deleting a project removes every case study of the card in one batch', async () => {
  await api('/api/content');
  fake.failWrites(1);
  await rejects(api('/api/content/p_p1/trash', { method: 'POST', body: {} }), 500);
  assert.ok(fake.get('projects/p1'), 'a failed delete leaves the card in place');
  assert.ok(fake.get('caseStudies/c1'));

  await api('/api/content/p_p1/trash', { method: 'POST', body: {} });
  const left = [...fake.docs.keys()].filter((path) => path === 'projects/p1' || path.startsWith('caseStudies/c1') || path.startsWith('caseStudies/c2'));
  assert.deepEqual(left, [], 'card, both case studies and all chunks are gone');
});

test('the studio escapes every record id it puts into markup', async () => {
  const source = await readFile(new URL('../studio.js', import.meta.url), 'utf8');
  assert.equal(/data-id="\$\{(?!esc\()/.test(source), false, 'no unescaped data-id interpolation');
  assert.match(source, /const SITE='https:\/\/www\.strixproduction\.com'/);
});
