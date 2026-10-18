/**
 * Public data layer: published-only queries, rules-denied reads, offline cache
 * answers, listener recovery and URL safety.
 */
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeFirebase } from '../src/admin/cms/tests/fakeFirebase.js';

const fake = createFakeFirebase();
const queries = [];
mock.module('firebase/firestore', {
  namedExports: {
    ...fake.firestore,
    query: (ref, ...constraints) => {
      queries.push({ path: ref.path, constraints });
      return fake.firestore.query(ref, ...constraints);
    },
  },
});
mock.module(new URL('../src/lib/firebase.js', import.meta.url).href, { namedExports: { app: {}, db: {} } });

const projects = await import('../src/lib/projects.js');
const { fetchCaseStudy, caseStudyMeta } = await import('../src/lib/caseStudies.js');
const { mapBlog } = await import('../src/lib/blogs.js');
const { createLiveCollection } = await import('../src/lib/liveCollection.js');
const { safeUrl, safeExternalUrl } = await import('../src/lib/urls.js');

const T0 = '2025-01-01T00:00:00.000Z';
const project = (overrides) => ({
  title: 'P', categoryText: '', image: 'https://res.cloudinary.com/x/p.jpg', link: '/case-study/p', externalLink: '',
  filters: { Design: [], Development: [], Production: [], MVP: [] }, status: 'published', createdAt: T0, updatedAt: T0, ...overrides,
});
fake.seed('projects/live', project({ title: 'Live', link: '/case-study/live', createdAt: '2025-02-01T00:00:00.000Z' }));
fake.seed('projects/secret', project({ title: 'Secret', link: '/case-study/secret', status: 'draft' }));
fake.seed('projects/nodate', project({ title: 'No date', link: '/case-study/nodate', createdAt: undefined }));
fake.seed('caseStudies/c-live', { projectId: 'live', projectTitle: 'Live', status: 'published', aboutProject: { description: 'About live' } });
fake.seed('caseStudies/c-secret', { projectId: 'secret', projectTitle: 'Secret', status: 'published' });
fake.seed('projects/Ab12', project({ title: 'Pretty', link: '/case-study/pretty' }));
fake.seed('caseStudies/c-pretty', { projectId: 'Ab12', projectTitle: 'Pretty', status: 'published' });
fake.seed('caseStudies/c-live/chunks/k1', { sectionName: 'hero_thumbnail', data: { heroThumbnail: 'https://img/new.jpg' }, createdAt: '2025-03-01' });
fake.seed('caseStudies/c-live/chunks/a0', { sectionName: 'hero_thumbnail', data: { heroThumbnail: 'https://img/old.jpg' }, createdAt: '2025-01-01' });

// Rules as proposed in firestore.rules: visitors read only published documents.
fake.setRules(({ op, path }) => {
  if (op !== 'read') return false;
  const data = fake.get(path);
  return !data || /\/chunks$/.test(path) || /^(projects|caseStudies|blogs)$/.test(path) || data.status === 'published';
});

test('the projects query asks Firestore for published cards only', () => {
  const query = projects.publishedProjectsQuery({});
  assert.deepEqual(query.constraints.map((c) => [c.type, c.field, c.value]), [['where', 'status', 'published']]);
});

test('published projects are sorted newest first and cards without createdAt are kept', async () => {
  const snapshot = await fake.firestore.getDocs(projects.publishedProjectsQuery({}));
  const list = projects.projectsFromDocs(snapshot.docs);
  assert.deepEqual(list.map((p) => p.title), ['Live', 'Pretty', 'No date']);
});

test('project links only use safe schemes', () => {
  const map = (data) => projects.mapProject('doc1', project(data));
  assert.equal(projects.projectHref(map({ link: 'javascript:alert(1)' })), '/case-study/doc1');
  assert.equal(projects.projectHref(map({ externalLink: 'javascript:alert(1)' })), '/case-study/p');
  assert.equal(projects.projectHref(map({ externalLink: 'https://client.example/' })), 'https://client.example/');
  assert.equal(projects.projectHref(map({ externalLink: '//evil.example' })), '/case-study/p');
  assert.equal(projects.mapProject('x', project({ image: 'javascript:alert(1)' })).image, '');
  assert.equal(projects.isPublished(projects.mapProject('x', project({ image: 'javascript:alert(1)' }))), false);
});

test('a published case study loads with the newest chunk winning, by slug and by id', async () => {
  const bySlug = await fetchCaseStudy('live');
  assert.equal(bySlug.status, 'ready');
  assert.equal(bySlug.record.media.thumbnail, 'https://img/new.jpg');
  assert.equal(caseStudyMeta(bySlug.record).path, '/case-study/live');
  const byId = await fetchCaseStudy('Ab12');
  assert.equal(byId.status, 'ready');
  assert.equal(caseStudyMeta(byId.record).path, '/case-study/pretty', 'a doc-id URL canonicalises to the slug URL');
  const lastQuery = queries.filter((q) => q.path === 'caseStudies').at(-1);
  assert.ok(lastQuery.constraints.some((c) => c.field === 'status' && c.value === 'published'));
});

test('a draft project is not found, even when read directly by id and refused by the rules', async () => {
  assert.equal((await fetchCaseStudy('secret')).status, 'not-found');
  assert.ok(fake.reads.includes('projects/secret'), 'the by-id read was attempted');
});

test('an empty answer from the offline cache is a temporary failure, not "not found"', async () => {
  const cached = {
    db: {},
    getDoc: fake.firestore.getDoc,
    getDocs: async (ref) => ({ ...(await fake.firestore.getDocs(ref)), docs: [], empty: true, metadata: { fromCache: true } }),
  };
  await assert.rejects(fetchCaseStudy('live', cached), { code: 'unavailable' });
});

test('ids that could escape the collection path are never read directly', async () => {
  const mark = fake.reads.length;
  assert.equal((await fetchCaseStudy('../admins/x')).status, 'not-found');
  assert.ok(!fake.reads.slice(mark).some((path) => path.includes('admins')));
});

test('blog images and author links are sanitised', () => {
  const blog = mapBlog('b', {
    headerText: 'T', image: 'javascript:alert(1)', detailsImage: 'https://img/cover.jpg', status: 'published',
    author: { name: 'A', avatar: 'data:text/html;base64,PHNjcmlwdD4=', linkedin: 'javascript:x', email: 'a"<b>@x.y' },
    content: [{ type: 'image', content: 'http://insecure/img.png' }, { type: 'paragraph', content: 'Hi' }],
  });
  assert.equal(blog.image, '');
  assert.equal(blog.coverImage, 'https://img/cover.jpg');
  assert.equal(blog.author.avatar, '');
  assert.equal(blog.author.linkedin, '');
  assert.equal(blog.author.email, '');
  assert.deepEqual(blog.content.map((b) => b.type), ['paragraph']);
});

test('url helpers reject unsafe schemes', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('//evil.example/x.png'), '');
  assert.equal(safeUrl('https://user:pw@x.example/a.png'), '');
  assert.equal(safeUrl('/assets/a.png'), '/assets/a.png');
  assert.equal(safeUrl('data:image/png;base64,QUFB'), 'data:image/png;base64,QUFB');
  assert.equal(safeUrl('data:image/png;base64,QUFB', { allowData: false }), '');
  assert.equal(safeExternalUrl('http://ok.example/'), 'http://ok.example/');
  assert.equal(safeExternalUrl('javascript:alert(1)'), '');
});

test('a live listener restarts with backoff after an error and keeps its last data', async () => {
  const timers = [];
  let calls = 0;
  const live = createLiveCollection({
    name: 'things',
    initial: { items: [] },
    schedule: (fn, delay) => timers.push({ fn, delay }),
    listen: (next, fail) => {
      calls += 1;
      if (calls === 1) queueMicrotask(() => next({ items: ['first'] }));
      if (calls === 2) queueMicrotask(() => next({ items: ['back'] }));
      // Firestore reports the error after the first snapshot and detaches the listener.
      if (calls === 1) setTimeout(() => fail(Object.assign(new Error('offline'), { code: 'unavailable' })));
      return () => {};
    },
  });
  const original = console.error;
  console.error = () => {};
  try {
    live.subscribe(() => {});
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(live.getState().error.code, 'unavailable');
    assert.deepEqual(live.getState().items, ['first'], 'data is kept while offline');
    assert.deepEqual(timers.map((t) => t.delay), [2000]);
    timers[0].fn();
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(calls, 2, 'the listener was started again');
    assert.deepEqual(live.getState().items, ['back']);
    assert.equal(live.getState().error, null);
  } finally {
    console.error = original;
  }
});
