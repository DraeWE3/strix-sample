/**
 * Studio backend against an in-memory Firestore, plus the public site's own data
 * layer (src/lib/caseStudies.js, src/lib/blogs.js) reading what the studio wrote.
 *
 * Run from strix-sample/:
 *   node --experimental-test-module-mocks --import ./src/admin/cms/tests/resolveHooks.js --test src/admin/cms/tests/
 */
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeFirebase } from './fakeFirebase.js';

const fake = createFakeFirebase();
mock.module('firebase/firestore', { namedExports: fake.firestore });
mock.module('firebase/auth', { namedExports: { ...fake.auth, getAuth: () => ({}) } });
mock.module(new URL('../../firebaseconfig.js', import.meta.url).href, { namedExports: { auth: {}, db: {} } });
mock.module(new URL('../../../lib/firebase.js', import.meta.url).href, { namedExports: { app: {}, db: {} } });
mock.module(new URL('../../storage.js', import.meta.url).href, { namedExports: fake.storage });

const { createBackend } = await import('../backend.js');
const { loadCaseStudy } = await import('../../../lib/caseStudies.js');
const { mapBlog } = await import('../../../lib/blogs.js');

const T0 = '2025-01-01T00:00:00.000Z';
const T1 = '2025-01-02T00:00:00.000Z';
const BASE64_A = 'data:image/png;base64,QUFBQQ==';
const BASE64_B = 'data:image/png;base64,QkJCQg==';

fake.seed('projects/p1', {
  title: 'Aurora', categoryText: 'UI/UX Design', industry: 'AI & technology', image: 'https://res.cloudinary.com/x/card.jpg',
  link: '/case-study/aurora', externalLink: '', filters: { Design: ['UI/UX'], Development: ['Website'], Production: [], MVP: [] },
  status: 'published', createdAt: T0, updatedAt: T1,
});
fake.seed('caseStudies/c1', {
  projectId: 'p1', projectTitle: 'Aurora AI', heroVideo: '', heroThumbnail: '',
  client: { name: 'Aurora', logo: '', industry: 'AI', country: 'India', services: 'UI/UX, Web' },
  aboutProject: { description: 'Original story', experienceLink: 'https://aurora.example', images: [] },
  processCards: [{ icon: '', hours: '10', title: 'Kick-off', details: ['a'] }],
  conceptSlides: ['https://c.example/1.jpg', '', '', '', '', 'https://c.example/6.jpg', '', '', ''],
  designSystemImage: '', responsiveImages: Array(8).fill(''),
  technologies: { design: ['Figma'], development: [], production: [] },
  results: [{ title: '2x', description: 'More sign-ups' }],
  status: 'published', createdAt: T0, updatedAt: T1,
});
fake.seed('caseStudies/c1/chunks/k1', { sectionName: 'hero_thumbnail', data: { heroThumbnail: BASE64_A } });
fake.seed('caseStudies/c1/chunks/k2', { sectionName: 'about_image_0', data: { image: BASE64_B, index: 0 } });
fake.seed('projects/p2', {
  title: 'Side quest', categoryText: 'Experiment', industry: '', image: '', link: '/case-study/side-quest',
  externalLink: 'https://lab.example', filters: { Design: [], Development: ['Web-app'], Production: [], MVP: [] },
  status: 'draft', createdAt: '2025-03-01T00:00:00.000Z', updatedAt: '2025-03-01T00:00:00.000Z',
});
fake.seed('caseStudies/c9', { projectId: 'missing', projectTitle: 'Lost one', status: 'draft', createdAt: T0, updatedAt: T0 });
fake.seed('blogs/b1', {
  headerText: 'How we design', topic: 'Design tips', tag: 'Tips', date: '2025-02-01',
  image: 'https://res.cloudinary.com/x/blog-card.jpg', detailsImage: 'https://res.cloudinary.com/x/blog-hero.jpg', excerpt: '',
  author: { name: 'Rajnandan', role: 'Founder', bio: '', avatar: '', linkedin: '', email: '' },
  content: [
    { id: 1, type: 'paragraph', content: 'Hello world' },
    { id: 2, type: 'subheading', content: 'Step one' },
    { id: 3, type: 'keypoints', content: ['Listen', 'Sketch'] },
    { id: 4, type: 'image', content: 'https://res.cloudinary.com/x/inline.jpg' },
    { id: 5, type: 'mystery', content: 'kept as is' },
  ],
  status: 'published', createdAt: T0, updatedAt: T1,
});

const backend = createBackend();
const api = backend.api;
const writesSince = (mark) => fake.writes.slice(mark);
const open = async (id) => api(`/api/content/${id}`);
const save = (record) => api(`/api/content/${record.id}`, { method: 'PUT', body: { version: record.version, kind: record.kind, data: record.data, meta: record.meta } });
// The public loader caches each slug for a minute; step the clock past that between reads.
let clockOffset = 0;
const realNow = Date.now;
Date.now = () => realNow() + clockOffset;
const publicCaseStudy = (slug) => {
  clockOffset += 61 * 1000;
  return loadCaseStudy(slug);
};
const rejects = async (promise, status, pattern) => {
  const error = await promise.then(() => null, (e) => e);
  assert.ok(error, 'expected the call to fail');
  assert.equal(error.status, status, error.message);
  if (pattern) assert.match(error.message, pattern);
  return error;
};

test('requires a Firebase sign-in before any content access', async () => {
  const session = await api('/api/session');
  assert.equal(session.authenticated, false);
  assert.equal(session.setupRequired, false);
  await rejects(api('/api/content'), 401);
  await rejects(api('/api/login', { method: 'POST', body: { email: 'admin@strix.test', password: 'wrong' } }), 500, /incorrect/);
  const signedIn = await api('/api/login', { method: 'POST', body: { email: 'admin@strix.test', password: 'correct horse battery' } });
  assert.equal(signedIn.authenticated, true);
  assert.equal(signedIn.user.email, 'admin@strix.test');
});

test('lists the existing Firestore records without writing anything', async () => {
  const mark = fake.writes.length;
  const { items } = await api('/api/content');
  assert.deepEqual(items.map((r) => r.id).sort(), ['a_b1', 'c_c9', 'p_p1', 'p_p2']);
  const aurora = items.find((r) => r.id === 'p_p1');
  assert.equal(aurora.status, 'published');
  assert.equal(aurora.liveUrl, '/case-study/aurora');
  assert.equal(aurora.data.slug, 'aurora');
  assert.equal(aurora.data.media.thumbnail, BASE64_A, 'hero thumbnail folded in from its chunk');
  assert.deepEqual(aurora.data.aboutImages.map((i) => i.src), [BASE64_B]);
  assert.deepEqual(aurora.data.concepts.map((row) => row.map((i) => i.src)), [['https://c.example/1.jpg'], ['https://c.example/6.jpg']]);
  assert.deepEqual(aurora.data.categories, ['design', 'development']);
  const orphan = items.find((r) => r.id === 'c_c9');
  assert.equal(orphan.orphan, true);
  assert.match(orphan.notice, /not linked/);
  const blog = items.find((r) => r.id === 'a_b1');
  assert.deepEqual(blog.data.body.map((b) => b.type), ['paragraph', 'heading', 'list', 'image', 'legacy']);
  assert.equal(blog.liveUrl, '/blog/b1');
  assert.deepEqual(writesSince(mark), []);
});

test('saving an unchanged record writes nothing', async () => {
  const mark = fake.writes.length;
  await save(await open('p_p1'));
  await save(await open('a_b1'));
  assert.deepEqual(writesSince(mark), []);
});

test('project edits update only the changed fields and keep the public case study intact', async () => {
  const record = await open('p_p1');
  record.data.title = 'Aurora Labs';
  record.data.about = 'A sharper story';
  const mark = fake.writes.length;
  const saved = await save(record);
  const writes = writesSince(mark);

  const card = writes.find((w) => w.path === 'projects/p1');
  assert.deepEqual(Object.keys(card.data).sort(), ['title', 'updatedAt']);
  const caseWrite = writes.find((w) => w.path === 'caseStudies/c1');
  assert.deepEqual(Object.keys(caseWrite.data).sort(), ['aboutProject', 'updatedAt']);
  assert.deepEqual(caseWrite.data.aboutProject, { description: 'A sharper story', experienceLink: 'https://aurora.example', images: [BASE64_B] });
  // The about image moved back into the (now small) main document; its chunk is removed, the hero chunk is not.
  assert.ok(writes.some((w) => w.op === 'delete' && w.path === 'caseStudies/c1/chunks/k2'));
  assert.ok(fake.get('caseStudies/c1/chunks/k1'));
  assert.deepEqual(fake.get('caseStudies/c1').processCards, [{ icon: '', hours: '10', title: 'Kick-off', details: ['a'] }], 'untouched fields preserved');
  assert.equal(fake.get('caseStudies/c1').template, undefined, 'no template is added to an existing case study');
  assert.equal(saved.data.title, 'Aurora Labs');

  const page = await publicCaseStudy('aurora');
  assert.equal(page.status, 'ready');
  assert.equal(page.record.title, 'Aurora AI');
  assert.equal(page.record.about, 'A sharper story');
  assert.equal(page.record.media.thumbnail, BASE64_A);
  assert.deepEqual(page.record.aboutImages.map((i) => i.src), [BASE64_B]);
  assert.deepEqual(page.record.results, [{ title: '2x', description: 'More sign-ups' }]);
  assert.deepEqual(page.record.services, ['UI/UX', 'Web']);
});

test('large sections are split into chunks the public page can still read', async () => {
  const record = await open('p_p1');
  const big = `data:image/png;base64,${'A'.repeat(200000)}`;
  record.data.media.thumbnail = big;
  const mark = fake.writes.length;
  await save(record);
  const writes = writesSince(mark);
  const chunk = writes.find((w) => w.op === 'set' && w.data.sectionName === 'hero_thumbnail');
  assert.ok(chunk, 'a hero chunk was written');
  assert.equal(writes.find((w) => w.path === 'caseStudies/c1').data.heroThumbnail, '');
  assert.ok(writes.some((w) => w.op === 'delete' && w.path === 'caseStudies/c1/chunks/k1'), 'the stale hero chunk is removed after the new one is stored');
  const page = await publicCaseStudy('aurora');
  assert.equal(page.status, 'ready');
  assert.equal(page.record.media.thumbnail, big);
  const reread = await open('p_p1');
  assert.equal(reread.data.media.thumbnail, big);
});

test('refuses to overwrite a document changed elsewhere', async () => {
  const record = await open('p_p1');
  fake.seed('projects/p1', { ...fake.get('projects/p1'), updatedAt: '2030-01-01T00:00:00.000Z' });
  record.data.categoryText = 'Changed here';
  await rejects(save(record), 409, /changed elsewhere/);
  assert.notEqual(fake.get('projects/p1').categoryText, 'Changed here');
  await api('/api/content');
});

test('validates content before saving or publishing', async () => {
  const record = await open('p_p1');
  record.data.cardImage = 'javascript:alert(1)';
  const unsafe = await rejects(save(record), 422);
  assert.ok(unsafe.fields.some((f) => f.field === 'data.cardImage'));

  const duplicate = await open('p_p2');
  duplicate.data.slug = 'aurora';
  await rejects(save(duplicate), 422);

  const before = fake.get('projects/p2');
  const noImage = await rejects(api('/api/content/p_p2/publish', { method: 'POST', body: {} }), 422);
  assert.ok(noImage.fields.some((f) => f.field === 'data.cardImage'));
  assert.deepEqual(fake.get('projects/p2'), before);

  const article = await open('a_b1');
  article.data.author.email = 'not-an-email';
  await rejects(save(article), 422);
});

test('publish and unpublish only change the status fields', async () => {
  const mark = fake.writes.length;
  const draft = await api('/api/content/p_p1/unpublish', { method: 'POST', body: {} });
  assert.equal(draft.status, 'draft');
  const statusWrites = writesSince(mark);
  assert.deepEqual(statusWrites.map((w) => [w.path, Object.keys(w.data).sort(), w.data.status]), [
    ['projects/p1', ['status', 'updatedAt'], 'draft'],
    ['caseStudies/c1', ['status', 'updatedAt'], 'draft'],
  ]);
  assert.equal(statusWrites[0].data.updatedAt, statusWrites[1].data.updatedAt, 'card and case study change in one commit');
  assert.equal((await publicCaseStudy('aurora')).status, 'not-found');
  const live = await api('/api/content/p_p1/publish', { method: 'POST', body: {} });
  assert.equal(live.status, 'published');
  assert.equal(fake.get('caseStudies/c1').status, 'published');
});

test('a new project is created as a draft with the case study only when it has content', async () => {
  const cardOnly = await api('/api/content', { method: 'POST', body: { kind: 'project', data: { template: 'production' } } });
  assert.equal(cardOnly.isNew, true);
  cardOnly.data.title = 'Promo reel';
  cardOnly.data.slug = 'promo-reel';
  let mark = fake.writes.length;
  const savedCard = await save(cardOnly);
  assert.deepEqual(writesSince(mark).map((w) => w.path.split('/')[0]), ['projects']);
  const cardDoc = fake.get(`projects/${savedCard.id.slice(2)}`);
  assert.equal(cardDoc.status, 'draft');
  assert.equal(cardDoc.link, '/case-study/promo-reel');
  assert.deepEqual(cardDoc.filters.Production, ['3D']);

  const withStory = await api('/api/content', { method: 'POST', body: { kind: 'project', data: { template: 'mvp' } } });
  withStory.data.title = 'Pilot';
  withStory.data.slug = 'pilot';
  withStory.data.about = 'We shipped a pilot.';
  withStory.data.shipped.items = ['Onboarding', 'Billing'];
  mark = fake.writes.length;
  const saved = await save(withStory);
  const caseAdd = writesSince(mark).find((w) => w.op === 'set' && /^caseStudies\/[^/]+$/.test(w.path));
  assert.equal(caseAdd.data.projectId, saved.id.slice(2));
  assert.equal(caseAdd.data.status, 'draft');
  const caseDoc = fake.get(caseAdd.path);
  assert.equal(caseDoc.template, 'mvp');
  assert.deepEqual(caseDoc.shipped.items, ['Onboarding', 'Billing']);
  assert.equal(caseDoc.aboutProject.description, 'We shipped a pilot.');
});

test('article edits keep block ids, unknown blocks and the public article shape', async () => {
  const record = await open('a_b1');
  record.data.body[1].text = 'Step one, revised';
  record.data.body.push({ type: 'list', items: ['Ship'] });
  const mark = fake.writes.length;
  await save(record);
  const [write] = writesSince(mark);
  assert.deepEqual(Object.keys(write.data).sort(), ['content', 'updatedAt']);
  const stored = fake.get('blogs/b1');
  assert.deepEqual(stored.content.slice(0, 5), [
    { id: 1, type: 'paragraph', content: 'Hello world' },
    { id: 2, type: 'subheading', content: 'Step one, revised' },
    { id: 3, type: 'keypoints', content: ['Listen', 'Sketch'] },
    { id: 4, type: 'image', content: 'https://res.cloudinary.com/x/inline.jpg' },
    { id: 5, type: 'mystery', content: 'kept as is' },
  ]);
  assert.equal(stored.content[5].type, 'keypoints');
  assert.equal('readTime' in stored, false, 'reading time stays estimated by the site');
  const publicBlog = mapBlog('b1', stored);
  assert.equal(publicBlog.title, 'How we design');
  assert.equal(publicBlog.cardTitle, 'Design tips');
  assert.deepEqual(publicBlog.content.map((b) => b.type), ['paragraph', 'subheading', 'keypoints', 'image', 'keypoints']);
});

test('a new article is stored as a draft in the blogs collection', async () => {
  const draft = await api('/api/content', { method: 'POST', body: { kind: 'article' } });
  draft.data.title = 'Fresh thinking';
  draft.data.body[0].text = 'First words';
  draft.data.readTime = '4';
  const mark = fake.writes.length;
  const saved = await save(draft);
  const [write] = writesSince(mark);
  assert.equal(write.op, 'set');
  assert.equal(write.path.split('/')[0], 'blogs');
  assert.equal(write.data.status, 'draft');
  assert.equal(write.data.headerText, 'Fresh thinking');
  assert.equal(write.data.readTime, 4);
  assert.equal('author' in write.data, false, 'no empty author card is added');
  assert.equal(saved.status, 'draft');
  assert.equal(mapBlog(saved.id.slice(2), fake.get(write.path)).status, 'draft');
});

test('permission errors from Firestore are reported clearly and change nothing', async () => {
  const record = await open('a_b1');
  record.data.excerpt = 'Denied edit';
  fake.setDenyWrites(true);
  try {
    await rejects(save(record), 403, /not allowed/);
  } finally {
    fake.setDenyWrites(false);
  }
  assert.notEqual(fake.get('blogs/b1').excerpt, 'Denied edit');
});

test('deleting a project removes its card, case study and chunks', async () => {
  await api('/api/content');
  const mark = fake.writes.length;
  await api('/api/content/p_p1/trash', { method: 'POST', body: {} });
  const deleted = writesSince(mark).filter((w) => w.op === 'delete').map((w) => w.path);
  assert.ok(deleted.includes('projects/p1'));
  assert.ok(deleted.includes('caseStudies/c1'));
  assert.equal([...fake.docs.keys()].filter((path) => path.startsWith('caseStudies/c1')).length, 0);
  assert.ok(fake.get('caseStudies/c9'), 'unrelated records untouched');
  assert.ok(fake.get('blogs/b1'));
});

test('signing out ends access', async () => {
  await api('/api/logout', { method: 'POST', body: {} });
  assert.equal((await api('/api/session')).authenticated, false);
  await rejects(api('/api/content'), 401);
  backend.dispose();
});

test('custom process steps are stored, default ones are not, and the public mapper uses them', async () => {
  const { mapCaseStudy } = await import('../../../lib/caseStudies.js');
  const { projectChanges, projectToEditor } = await import('../mapping.js');
  const base = projectToEditor({ id: 'p1', data: { filters: { Design: ['UI/UX'] } } }, { id: 'c1', data: { template: 'mvp' } });
  assert.equal(base.process.length, 4);
  assert.deepEqual(projectChanges(base, base, { hasCaseStudy: true, templateStored: true }).sections, {});
  const edited = { ...base, process: [{ title: 'Kickoff', description: 'Hello' }, ...base.process.slice(1)] };
  const { sections } = projectChanges(edited, base, { hasCaseStudy: true, templateStored: true });
  assert.equal(sections.process.process[0].title, 'Kickoff');
  const project = { id: 'p1', title: 'T', filters: { Design: [], Development: [], Production: [], MVP: [] } };
  assert.equal(mapCaseStudy({ id: 'c1', template: 'mvp', process: sections.process.process }, project).process[0].title, 'Kickoff');
  assert.equal(mapCaseStudy({ id: 'c1', template: 'mvp', process: [] }, project).process[0].title, 'Discovery & Wireframes');
});
