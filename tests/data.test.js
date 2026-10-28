/**
 * Public data layer: published-only queries, rows hidden by row-level
 * security, unreachable-database errors, listener recovery and URL safety.
 */
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { createFakeNeon } from '../src/admin/cms/tests/fakeNeon.js';

const fake = createFakeNeon();
globalThis.__STRIX_TEST_ENV__ = { VITE_NEON_DATA_API_URL: 'https://data.test/rest/v1', VITE_NEON_AUTH_URL: 'https://auth.test/auth' };
mock.module('@neondatabase/postgrest-js', {
  namedExports: {
    NeonPostgrestClient: function NeonPostgrestClient() {
      return fake.anonymous;
    },
    fetchWithToken: () => fetch,
  },
});

const projects = await import('../src/lib/projects.js');
const { fetchCaseStudy, caseStudyMeta } = await import('../src/lib/caseStudies.js');
const { mapBlog } = await import('../src/lib/blogs.js');
const { createLiveCollection } = await import('../src/lib/liveCollection.js');
const { createAnonymousTokenSource, run } = await import('../src/lib/neon.js');
const { safeUrl, safeExternalUrl } = await import('../src/lib/urls.js');

const T0 = '2025-01-01T00:00:00.000Z';
const project = (overrides) => ({
  title: 'P', categoryText: '', image: 'https://res.cloudinary.com/x/p.jpg', link: '/case-study/p', externalLink: '',
  filters: { Design: [], Development: [], Production: [], MVP: [] }, status: 'published', createdAt: T0, updatedAt: T0, ...overrides,
});
fake.seed('projects', 'live', project({ title: 'Live', link: '/case-study/live', createdAt: '2025-02-01T00:00:00.000Z' }));
fake.seed('projects', 'secret', project({ title: 'Secret', link: '/case-study/secret', status: 'draft' }));
fake.seed('projects', 'nodate', project({ title: 'No date', link: '/case-study/nodate', createdAt: undefined }));
fake.seed('case_studies', 'c-live', { projectId: 'live', projectTitle: 'Live', status: 'published', heroThumbnail: 'https://img/new.jpg', aboutProject: { description: 'About live' } });
fake.seed('case_studies', 'c-secret', { projectId: 'secret', projectTitle: 'Secret', status: 'published' });
fake.seed('projects', 'Ab12', project({ title: 'Pretty', link: '/case-study/pretty' }));
fake.seed('case_studies', 'c-pretty', { projectId: 'Ab12', projectTitle: 'Pretty', status: 'published' });

test('the projects query asks for published cards only', async () => {
  const mark = fake.queries.length;
  await run(projects.publishedProjectsQuery(fake.anonymous));
  assert.deepEqual(fake.queries.slice(mark).map((q) => [q.table, q.filters]), [['projects', [['status', 'published']]]]);
});

test('published projects are sorted newest first and cards without createdAt are kept', async () => {
  const list = projects.projectsFromRows(await run(projects.publishedProjectsQuery(fake.anonymous)));
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

test('a published case study loads by slug and by id', async () => {
  const bySlug = await fetchCaseStudy('live');
  assert.equal(bySlug.status, 'ready');
  assert.equal(bySlug.record.media.thumbnail, 'https://img/new.jpg');
  assert.equal(caseStudyMeta(bySlug.record).path, '/case-study/live');
  const byId = await fetchCaseStudy('Ab12');
  assert.equal(byId.status, 'ready');
  assert.equal(caseStudyMeta(byId.record).path, '/case-study/pretty', 'a row-id URL canonicalises to the slug URL');
  const lastQuery = fake.queries.filter((q) => q.table === 'case_studies').at(-1);
  assert.ok(lastQuery.filters.some(([name, value]) => name === 'status' && value === 'published'));
});

test('case study SEO uses the studio fields and falls back when they are blank', async () => {
  const { mapCaseStudy } = await import('../src/lib/caseStudies.js');
  const card = projects.mapProject('live', project({ title: 'Live', link: '/case-study/live' }));
  const custom = caseStudyMeta(mapCaseStudy({ id: 'c', seo: { title: ' Custom title ', description: 'Custom description' } }, card));
  assert.equal(custom.title, 'Custom title');
  assert.equal(custom.description, 'Custom description');
  const long = 'word '.repeat(60);
  const fallback = caseStudyMeta(mapCaseStudy({ id: 'c', projectTitle: 'Live', aboutProject: { description: long } }, card));
  assert.equal(fallback.title, 'Live — Case Study');
  assert.ok(fallback.description.length <= 160 && fallback.description.endsWith('word…'), fallback.description);
});

test('a draft project is not found, even when read directly by id', async () => {
  const mark = fake.queries.length;
  assert.equal((await fetchCaseStudy('secret')).status, 'not-found');
  assert.ok(fake.queries.slice(mark).some((q) => q.filters.some(([name, value]) => name === 'id' && value === 'secret')), 'the by-id read was attempted');
});

test('an unreachable database is a temporary failure, not "not found"', async () => {
  const offline = { from: () => ({ select: () => offlineQuery }) };
  const offlineQuery = {
    eq: () => offlineQuery,
    order: () => offlineQuery,
    limit: () => offlineQuery,
    then: (resolve) => resolve({ data: null, error: { message: 'TypeError: fetch failed' }, status: 0 }),
  };
  await assert.rejects(fetchCaseStudy('live', offline), { code: 'unavailable' });
});

test('ids that are not plain row ids are never read directly', async () => {
  const mark = fake.queries.length;
  assert.equal((await fetchCaseStudy('../admins/x')).status, 'not-found');
  assert.ok(!fake.queries.slice(mark).some((q) => q.filters.some(([name]) => name === 'id')));
});

test('the visitor token is fetched once and reused until it nearly expires', async () => {
  let calls = 0;
  const request = async (url) => {
    calls += 1;
    assert.equal(url, 'https://auth.test/auth/token/anonymous');
    return { ok: true, json: async () => ({ token: `t${calls}`, expires_at: Math.floor(Date.now() / 1000) + 900 }) };
  };
  const token = createAnonymousTokenSource('https://auth.test/auth/', request);
  assert.deepEqual(await Promise.all([token(), token()]), ['t1', 't1']);
  assert.equal(await token(), 't1');
  assert.equal(calls, 1);
  const refused = createAnonymousTokenSource('https://auth.test/auth', async () => ({ ok: false, status: 403 }));
  await assert.rejects(refused(), { code: 'unavailable' });
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
      // The poller reports a failed read after the first one and stops.
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
