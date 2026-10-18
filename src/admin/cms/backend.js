/**
 * Firestore, Firebase Auth and Cloudinary backend for the Strix Content Studio.
 * It answers the studio's `api(path, options)` calls (originally served by the
 * generated CMS's Python server) using the same collections, fields, status
 * values and upload preset as the previous admin panel and the public site.
 */
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  collection, deleteDoc, doc, getDocFromServer, getDocsFromServer, query, runTransaction, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebaseconfig.js';
import { uploadImage } from '../storage.js';
import {
  articleChanges, articleToEditor, blankArticle, blankProject, categoriesFromFilters, changedFieldErrors,
  chunkBelongsTo, isSafeId, isSafeUrl, projectChanges, projectToEditor, reconstructCaseStudy, splitSection,
  validateArticle, validateProject,
} from './mapping.js';

const PROJECTS = 'projects';
const CASE_STUDIES = 'caseStudies';
const BLOGS = 'blogs';
const ADMINS = 'admins';
const SITE_URL = 'https://www.strixproduction.com';
const PINNED_TOPICS = ['Tips', 'News'];
// Firestore commits are limited to 500 writes and about 10 MiB; stay under both.
const MAX_COMMIT_WRITES = 450;
const MAX_COMMIT_BYTES = 9 * 1024 * 1024;

class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

const now = () => new Date().toISOString();
const clone = (value) => JSON.parse(JSON.stringify(value));
const asString = (value) => (typeof value === 'string' ? value : '');

const FIREBASE_MESSAGES = {
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'You appear to be offline. Check your connection and try again.',
  'permission-denied': 'Your account is not allowed to make this change.',
  unauthenticated: 'Your session expired. Sign in again.',
  unavailable: 'The database is unreachable. Check your connection and try again. Nothing was saved.',
  aborted: 'Someone else saved at the same moment. Reload the page and try again.',
  'deadline-exceeded': 'The database took too long to answer. Nothing was saved; try again.',
};

const friendly = (error) => {
  if (error instanceof ApiError) return error;
  const message = FIREBASE_MESSAGES[error?.code] || error?.message || 'The request could not be completed.';
  return new ApiError(error?.code === 'permission-denied' ? 403 : 500, message);
};

/** Same rules as `projectHref` on the public site: an https link out, or the case-study page. */
const liveProjectUrl = (card, id) => {
  const external = asString(card.externalLink).trim();
  if (/^https:\/\//i.test(external) && isSafeUrl(external)) return external;
  const link = asString(card.link).trim().replace(/\/+$/, '');
  return /^\/case-study\/[A-Za-z0-9_-]+$/.test(link) ? link : `/case-study/${encodeURIComponent(id)}`;
};

const byteSize = (value) => new TextEncoder().encode(JSON.stringify(value ?? null)).length;

/** Commits `changes` atomically when they fit in one transaction, after `checks` pass inside it. */
const fitsInOneCommit = (changes) =>
  changes.length <= MAX_COMMIT_WRITES && changes.reduce((total, change) => total + byteSize(change.data), 0) <= MAX_COMMIT_BYTES;

export const createBackend = () => {
  /** @type {Map<string, { envelope: Record<string, any>, source: Record<string, any> }>} */
  const records = new Map();
  const uploads = [];
  const saving = new Set();
  let user = null;
  let isAdmin = false;
  let stopAuth = null;
  const authReady = new Promise((resolve) => {
    stopAuth = onAuthStateChanged(auth, (next) => {
      user = next;
      isAdmin = false;
      resolve();
    });
  });

  /**
   * A signed-in account is a studio admin only with an `admin` custom claim or
   * an `admins/{uid}` document. Firestore rules enforce the same check; this
   * keeps everyone else out of the studio UI.
   */
  const verifyAdmin = async () => {
    if (!user) return false;
    if (isAdmin) return true;
    const token = await user.getIdTokenResult?.();
    if (token?.claims?.admin === true) return (isAdmin = true);
    try {
      isAdmin = (await getDocFromServer(doc(db, ADMINS, user.uid))).exists();
    } catch (error) {
      if (error?.code !== 'permission-denied') throw error;
      isAdmin = false;
    }
    return isAdmin;
  };

  const refuse = async () => {
    await signOut(auth);
    user = null;
    isAdmin = false;
    records.clear();
    throw new ApiError(403, 'This account is not a studio administrator. Ask an existing admin to add it.');
  };

  const sessionPayload = () => ({
    setupRequired: false,
    authenticated: Boolean(user && isAdmin),
    user: user && isAdmin ? { id: user.uid, name: user.displayName || user.email, email: user.email } : null,
  });

  const requireAdmin = () => {
    if (!user) throw new ApiError(401, 'Sign in to continue.');
    if (!isAdmin) throw new ApiError(403, 'This account is not a studio administrator.');
  };

  /* --------------------------------------------------------- envelopes */

  const projectEnvelope = ({ project, caseStudy, chunks, isNew = false, template }) => {
    const reconstructed = caseStudy ? { id: caseStudy.id, data: reconstructCaseStudy(caseStudy.data, chunks.map((c) => c.data)) } : null;
    const data = isNew ? blankProject(template) : projectToEditor(project, reconstructed);
    const orphan = !project && !isNew;
    const cardLive = project?.data.status === 'published';
    const caseLive = caseStudy?.data.status === 'published';
    const card = project ? project.data : {};
    let notice = '';
    if (orphan) notice = 'This case study is not linked to a project card, so the website cannot show it.';
    else if (cardLive && caseStudy && !caseLive && !/^https?:\/\//.test(asString(card.externalLink))) notice = 'The portfolio card is live, but its case study page is still a draft. Publish to show both.';
    else if (!cardLive && caseLive) notice = 'The case study is marked published, but its portfolio card is a draft, so the page is hidden.';
    const id = project ? `p_${project.id}` : isNew ? `new_${Date.now().toString(36)}` : `c_${caseStudy.id}`;
    const createdAt = asString(project?.data.createdAt) || asString(caseStudy?.data.createdAt);
    const updatedAt = [project?.data.updatedAt, caseStudy?.data.updatedAt].map(asString).sort().pop() || createdAt;
    return {
      envelope: {
        id,
        kind: 'project',
        status: (orphan ? caseLive : cardLive) ? 'published' : 'draft',
        version: 1,
        createdAt,
        updatedAt,
        publishedAt: null,
        trashedAt: null,
        hasUnpublishedChanges: false,
        isNew,
        orphan,
        notice,
        liveUrl: cardLive && project ? liveProjectUrl(card, project.id) : '',
        data,
        meta: {},
      },
      source: {
        projectId: project?.id || null,
        projectUpdatedAt: asString(project?.data.updatedAt),
        caseId: caseStudy?.id || null,
        caseUpdatedAt: asString(caseStudy?.data.updatedAt),
        templateStored: Boolean(caseStudy?.data.template),
        chunks: chunks.map(({ id: chunkId, data: chunkData }) => ({ id: chunkId, sectionName: asString(chunkData.sectionName) })),
        original: clone(data),
        isNew,
      },
    };
  };

  const articleEnvelope = ({ blog, isNew = false, category }) => {
    const data = isNew ? blankArticle(category) : articleToEditor(blog);
    const live = blog?.data.status === 'published';
    return {
      envelope: {
        id: isNew ? `new_${Date.now().toString(36)}` : `a_${blog.id}`,
        kind: 'article',
        status: live ? 'published' : 'draft',
        version: 1,
        createdAt: asString(blog?.data.createdAt),
        updatedAt: asString(blog?.data.updatedAt) || asString(blog?.data.createdAt),
        publishedAt: null,
        trashedAt: null,
        hasUnpublishedChanges: false,
        isNew,
        notice: '',
        liveUrl: live ? `/blog/${encodeURIComponent(blog.id)}` : '',
        data,
        meta: {},
      },
      source: {
        blogId: blog?.id || null,
        updatedAt: asString(blog?.data.updatedAt),
        hadAuthor: Boolean(blog?.data.author),
        hadReadTime: blog ? Object.prototype.hasOwnProperty.call(blog.data, 'readTime') : false,
        original: clone(data),
        isNew,
      },
    };
  };

  const remember = (entry) => {
    records.set(entry.envelope.id, entry);
    return clone(entry.envelope);
  };

  /* ------------------------------------------------------------- reads */

  const snapshotDocs = (snapshot) => snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));

  const loadChunks = async (caseId) => snapshotDocs(await getDocsFromServer(collection(db, CASE_STUDIES, caseId, 'chunks')));

  // Ids end up in markup and API paths; documents with any other id are left out (and reported).
  const safeDocs = (name, list) => {
    const unsafe = list.filter((item) => !isSafeId(item.id));
    if (unsafe.length) console.warn(`Strix Studio: skipped ${unsafe.length} ${name} document(s) with unsupported ids.`);
    return list.filter((item) => isSafeId(item.id));
  };

  const loadAll = async () => {
    const [projects, cases, blogs] = (
      await Promise.all([PROJECTS, CASE_STUDIES, BLOGS].map((name) => getDocsFromServer(collection(db, name))))
    ).map((snapshot, index) => safeDocs([PROJECTS, CASE_STUDIES, BLOGS][index], snapshotDocs(snapshot)));
    const chunks = await Promise.all(cases.map((c) => loadChunks(c.id)));
    const casesByProject = new Map();
    // The public page reads the first case study per project in document-id order.
    cases
      .map((c, i) => ({ ...c, chunks: chunks[i] }))
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .forEach((c) => {
        const key = asString(c.data.projectId);
        if (!casesByProject.has(key)) casesByProject.set(key, []);
        casesByProject.get(key).push(c);
      });
    const projectIds = new Set(projects.map((p) => p.id));

    // Unsaved new records only exist here, so keep them across reloads.
    for (const [id, entry] of records) if (!entry.envelope.isNew) records.delete(id);
    for (const project of projects) {
      const [linked] = casesByProject.get(project.id) || [];
      remember(projectEnvelope({ project, caseStudy: linked || null, chunks: linked?.chunks || [] }));
    }
    for (const [projectId, list] of casesByProject) {
      // Case studies the website never shows: no project card, or a second one for the same card.
      list.slice(projectIds.has(projectId) ? 1 : 0).forEach((c) => remember(projectEnvelope({ project: null, caseStudy: c, chunks: c.chunks })));
    }
    blogs.forEach((blog) => remember(articleEnvelope({ blog })));
  };

  const reloadProject = async ({ projectId, caseId }) => {
    const project = projectId ? await getDocFromServer(doc(db, PROJECTS, projectId)) : null;
    const caseSnap = caseId ? await getDocFromServer(doc(db, CASE_STUDIES, caseId)) : null;
    const caseStudy = caseSnap?.exists() ? { id: caseSnap.id, data: caseSnap.data() } : null;
    return projectEnvelope({
      project: project?.exists() ? { id: project.id, data: project.data() } : null,
      caseStudy,
      chunks: caseStudy ? await loadChunks(caseStudy.id) : [],
    });
  };

  const reloadArticle = async (blogId) => {
    const snapshot = await getDocFromServer(doc(db, BLOGS, blogId));
    if (!snapshot.exists()) throw new ApiError(404, 'This article no longer exists.');
    return articleEnvelope({ blog: { id: snapshot.id, data: snapshot.data() } });
  };

  const entryFor = (id) => {
    const entry = records.get(id);
    if (!entry) throw new ApiError(404, 'Content not found. Reload the page.');
    return entry;
  };

  const otherProjectSlugs = (id) =>
    [...records.values()]
      .filter(({ envelope }) => envelope.kind === 'project' && envelope.id !== id && !envelope.orphan)
      .map(({ envelope }) => envelope.data.slug)
      .filter(Boolean);

  /** Slugs are checked against the server, not only the records open in this tab. */
  const assertSlugFree = async (link, projectId) => {
    if (!link.startsWith('/case-study/')) return;
    const taken = await getDocsFromServer(query(collection(db, PROJECTS), where('link', '==', link)));
    if (taken.docs.some((d) => d.id !== projectId)) {
      throw new ApiError(422, 'Review the highlighted fields before saving.', [{ field: 'data.slug', message: 'Another project already uses this URL slug.' }]);
    }
  };

  /* ------------------------------------------------------------ writes */

  const checkVersion = (snapshot, expectedUpdatedAt) => {
    if (!snapshot.exists()) throw new ApiError(409, 'This item was deleted elsewhere. Reload the page.');
    if (asString(snapshot.data().updatedAt) !== expectedUpdatedAt) {
      throw new ApiError(409, 'This item was changed elsewhere since you opened it. Reload it before saving again.');
    }
  };

  /**
   * Applies a write plan. Normally one transaction re-checks every document's
   * `updatedAt` and commits all changes together, so a failure or a concurrent
   * edit leaves nothing half-written. Plans too large for one commit (old
   * base64 images) fall back to ordered writes that never lose data: new
   * chunks first, then the main documents, then stale chunks.
   * @param {Array<{ op: 'set' | 'update' | 'delete', ref: any, data?: Record<string, unknown> }>} changes
   * @param {Array<{ ref: any, updatedAt: string }>} checks
   */
  const commit = async (changes, checks = []) => {
    if (fitsInOneCommit(changes)) {
      await runTransaction(db, async (tx) => {
        const snapshots = await Promise.all(checks.map((check) => tx.get(check.ref)));
        snapshots.forEach((snapshot, index) => checkVersion(snapshot, checks[index].updatedAt));
        for (const change of changes) {
          if (change.op === 'set') tx.set(change.ref, change.data);
          else if (change.op === 'update') tx.update(change.ref, change.data);
          else tx.delete(change.ref);
        }
      });
      return;
    }
    for (const check of checks) checkVersion(await getDocFromServer(check.ref), check.updatedAt);
    const rank = (change) => (change.op === 'set' && change.chunk ? 0 : change.op === 'delete' ? 2 : 1);
    for (const change of changes.slice().sort((a, b) => rank(a) - rank(b))) {
      if (change.op === 'set') await setDoc(change.ref, change.data);
      else if (change.op === 'update') await updateDoc(change.ref, change.data);
      else await deleteDoc(change.ref);
    }
  };

  /**
   * Writes for rewriting case-study sections. Stale chunks are looked up on the
   * server at save time, so leftovers from an earlier failed save are removed too.
   */
  const sectionChanges = async (caseId, sections, { isNewCase, stamp }) => {
    const main = {};
    const added = [];
    for (const [name, fields] of Object.entries(sections)) {
      const split = splitSection(name, fields);
      Object.assign(main, split.main);
      added.push(...split.chunks);
    }
    const existing = isNewCase ? [] : await loadChunks(caseId);
    const stale = existing.filter((chunk) => Object.keys(sections).some((name) => chunkBelongsTo(name, asString(chunk.data.sectionName))));
    const chunks = collection(db, CASE_STUDIES, caseId, 'chunks');
    return {
      main,
      changes: [
        ...added.map((chunk) => ({ op: 'set', chunk: true, ref: doc(chunks), data: { ...chunk, createdAt: stamp, updatedAt: stamp } })),
        ...stale.map((chunk) => ({ op: 'delete', ref: doc(db, CASE_STUDIES, caseId, 'chunks', chunk.id) })),
      ],
    };
  };

  /** One save per record at a time; a second click or Ctrl+S while saving is refused. */
  const exclusive = async (envelope, task) => {
    if (saving.has(envelope.id)) throw new ApiError(409, 'This item is already being saved. Wait a moment.');
    saving.add(envelope.id);
    try {
      return await task();
    } finally {
      saving.delete(envelope.id);
    }
  };

  const saveProject = async (entry, data) => {
    const { source, envelope } = entry;
    data.categories = categoriesFromFilters(data.filters);
    const errors = validateProject(data, { otherSlugs: otherProjectSlugs(envelope.id), hasProject: !envelope.orphan });
    const fields = source.isNew ? errors : changedFieldErrors(errors, data, source.original);
    if (fields.length) throw new ApiError(422, 'Review the highlighted fields before saving.', fields);

    const { card, sections, createCaseStudy } = projectChanges(data, source.original, {
      isNew: source.isNew,
      hasCaseStudy: Boolean(source.caseId),
      hasProject: !envelope.orphan,
      templateStored: source.templateStored,
    });
    if (!Object.keys(card).length && !Object.keys(sections).length) return clone(envelope);

    // Ids are chosen once per new record, so retrying a failed save rewrites the same documents instead of adding duplicates.
    if (source.isNew) source.pendingProjectId ||= doc(collection(db, PROJECTS)).id;
    if (createCaseStudy) source.pendingCaseId ||= doc(collection(db, CASE_STUDIES)).id;
    const projectId = source.projectId || source.pendingProjectId || null;
    const caseId = source.caseId || (createCaseStudy ? source.pendingCaseId : null);
    if (card.link) await assertSlugFree(card.link, projectId);

    const stamp = now();
    const changes = [];
    const checks = [];
    if (source.projectId) checks.push({ ref: doc(db, PROJECTS, source.projectId), updatedAt: source.projectUpdatedAt });
    if (source.caseId) checks.push({ ref: doc(db, CASE_STUDIES, source.caseId), updatedAt: source.caseUpdatedAt });

    if (source.isNew) {
      changes.push({ op: 'set', ref: doc(db, PROJECTS, projectId), data: { ...card, status: 'draft', createdAt: stamp, updatedAt: stamp } });
    } else if (projectId && Object.keys(card).length) {
      changes.push({ op: 'update', ref: doc(db, PROJECTS, projectId), data: { ...card, updatedAt: stamp } });
    }
    if (caseId && Object.keys(sections).length) {
      const written = await sectionChanges(caseId, sections, { isNewCase: createCaseStudy, stamp });
      if (createCaseStudy) {
        // A first case study follows the card's status, so a live card never links to a hidden page.
        const status = envelope.status === 'published' ? 'published' : 'draft';
        changes.push({ op: 'set', ref: doc(db, CASE_STUDIES, caseId), data: { projectId, status, createdAt: stamp, ...written.main, updatedAt: stamp } });
      } else {
        changes.push({ op: 'update', ref: doc(db, CASE_STUDIES, caseId), data: { ...written.main, updatedAt: stamp } });
      }
      changes.push(...written.changes);
    }
    await commit(changes, checks);
    records.delete(envelope.id);
    return remember(await reloadProject({ projectId, caseId }));
  };

  const saveArticle = async (entry, data) => {
    const { source, envelope } = entry;
    const errors = validateArticle(data);
    const fields = source.isNew ? errors : changedFieldErrors(errors, data, source.original);
    if (fields.length) throw new ApiError(422, 'Review the highlighted fields before saving.', fields);
    const changes = articleChanges(data, source.original, { isNew: source.isNew, hadAuthor: source.hadAuthor, hadReadTime: source.hadReadTime });
    const stamp = now();
    if (source.isNew) source.pendingBlogId ||= doc(collection(db, BLOGS)).id;
    const blogId = source.blogId || source.pendingBlogId;
    if (source.isNew) {
      await commit([{ op: 'set', ref: doc(db, BLOGS, blogId), data: { ...changes, status: 'draft', createdAt: stamp, updatedAt: stamp } }]);
    } else if (Object.keys(changes).length) {
      await commit([{ op: 'update', ref: doc(db, BLOGS, blogId), data: { ...changes, updatedAt: stamp } }], [{ ref: doc(db, BLOGS, blogId), updatedAt: source.updatedAt }]);
    } else {
      return clone(envelope);
    }
    records.delete(envelope.id);
    return remember(await reloadArticle(blogId));
  };

  const setStatus = async (entry, status) => {
    const { envelope, source } = entry;
    if (envelope.isNew) throw new ApiError(409, 'Save this item before publishing it.');
    if (status === 'published') {
      const fields = envelope.kind === 'project'
        ? validateProject(envelope.data, { publish: true, otherSlugs: otherProjectSlugs(envelope.id), hasProject: !envelope.orphan })
        : validateArticle(envelope.data, { publish: true });
      if (fields.length) throw new ApiError(422, 'Review the highlighted fields before publishing.', fields);
    }
    const stamp = now();
    if (envelope.kind === 'article') {
      const ref = doc(db, BLOGS, source.blogId);
      await commit([{ op: 'update', ref, data: { status, updatedAt: stamp } }], [{ ref, updatedAt: source.updatedAt }]);
      return remember(await reloadArticle(source.blogId));
    }
    if (envelope.orphan) throw new ApiError(409, 'Link this case study to a project card before publishing it.');
    // Card and case study change together, so the site never shows a card whose page is hidden (or the reverse).
    const changes = [{ op: 'update', ref: doc(db, PROJECTS, source.projectId), data: { status, updatedAt: stamp } }];
    const checks = [{ ref: doc(db, PROJECTS, source.projectId), updatedAt: source.projectUpdatedAt }];
    if (source.caseId) {
      changes.push({ op: 'update', ref: doc(db, CASE_STUDIES, source.caseId), data: { status, updatedAt: stamp } });
      checks.push({ ref: doc(db, CASE_STUDIES, source.caseId), updatedAt: source.caseUpdatedAt });
    }
    await commit(changes, checks);
    return remember(await reloadProject(source));
  };

  /** Deletes in batches of at most MAX_COMMIT_WRITES; each batch is atomic. */
  const deleteAll = async (refs) => {
    for (let index = 0; index < refs.length; index += MAX_COMMIT_WRITES) {
      const batch = writeBatch(db);
      refs.slice(index, index + MAX_COMMIT_WRITES).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  };

  const remove = async (entry) => {
    const { envelope, source } = entry;
    if (!envelope.isNew) {
      if (envelope.kind === 'article') await deleteAll([doc(db, BLOGS, source.blogId)]);
      else {
        // Every case study of the card goes too, not only the one shown, so no orphans are left behind.
        const caseIds = new Set(source.caseId ? [source.caseId] : []);
        if (source.projectId) {
          const linked = await getDocsFromServer(query(collection(db, CASE_STUDIES), where('projectId', '==', source.projectId)));
          linked.docs.forEach((d) => caseIds.add(d.id));
        }
        const refs = [];
        // The card is removed first (in the first batch), so the live site stops linking to the case study at once.
        if (source.projectId) refs.push(doc(db, PROJECTS, source.projectId));
        for (const caseId of caseIds) {
          const chunks = await loadChunks(caseId);
          refs.push(...chunks.map((chunk) => doc(db, CASE_STUDIES, caseId, 'chunks', chunk.id)), doc(db, CASE_STUDIES, caseId));
        }
        await deleteAll(refs);
      }
    }
    records.delete(envelope.id);
    return { ...clone(envelope), trashedAt: now() };
  };

  const settings = () => {
    const topics = [...new Set([...records.values()].filter(({ envelope }) => envelope.kind === 'article').map(({ envelope }) => envelope.data.category).filter(Boolean))];
    return {
      siteName: 'Strix Production',
      siteUrl: SITE_URL,
      bookingUrl: 'https://calendly.com/strixmufasa/30min',
      blogCategories: [...PINNED_TOPICS, ...topics.filter((topic) => !PINNED_TOPICS.includes(topic))],
    };
  };

  const upload = async (file) => {
    const url = await uploadImage(file);
    if (!url) throw new ApiError(500, 'The upload did not return an image link.');
    const media = { id: `upload_${Date.now().toString(36)}`, url, filename: file.name, mime: file.type, size: file.size, alt: '', createdAt: now() };
    uploads.unshift(media);
    return media;
  };

  /* ------------------------------------------------------------ router */

  const route = async (path, { method = 'GET', body, raw } = {}) => {
    const [pathname, search = ''] = path.split('?');
    if (pathname === '/api/session') {
      await authReady;
      if (user && !(await verifyAdmin())) await refuse();
      return sessionPayload();
    }
    if (pathname === '/api/login' && method === 'POST') {
      const credential = await signInWithEmailAndPassword(auth, asString(body?.email).trim(), asString(body?.password));
      user = credential.user;
      isAdmin = false;
      if (!(await verifyAdmin())) await refuse();
      return sessionPayload();
    }
    if (pathname === '/api/logout' && method === 'POST') {
      await signOut(auth);
      user = null;
      isAdmin = false;
      records.clear();
      return { ok: true };
    }
    requireAdmin();
    if (pathname === '/api/settings' && method === 'GET') return settings();
    if (pathname === '/api/media' && method === 'GET') return { items: uploads.slice() };
    if (pathname === '/api/media' && method === 'POST') return upload(raw);
    if (pathname === '/api/content' && method === 'GET') {
      if (new URLSearchParams(search).get('trash') === '1') return { items: [] };
      await loadAll();
      const items = [...records.values()].map(({ envelope }) => clone(envelope));
      return { items: items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
    }
    if (pathname === '/api/content' && method === 'POST') {
      return remember(body?.kind === 'article'
        ? articleEnvelope({ isNew: true, category: settings().blogCategories[0] })
        : projectEnvelope({ isNew: true, template: body?.data?.template, project: null, caseStudy: null, chunks: [] }));
    }
    const match = /^\/api\/content\/([A-Za-z0-9_-]+)(?:\/(publish|unpublish|trash))?$/.exec(pathname);
    if (match) {
      const entry = entryFor(match[1]);
      const action = match[2];
      if (!action && method === 'GET') return clone(entry.envelope);
      if (!action && method === 'PUT') {
        const data = clone(body?.data || {});
        return exclusive(entry.envelope, () => (entry.envelope.kind === 'article' ? saveArticle(entry, data) : saveProject(entry, data)));
      }
      if (action === 'publish' && method === 'POST') return exclusive(entry.envelope, () => setStatus(entry, 'published'));
      if (action === 'unpublish' && method === 'POST') return exclusive(entry.envelope, () => setStatus(entry, 'draft'));
      if (action === 'trash' && method === 'POST') return exclusive(entry.envelope, () => remove(entry));
    }
    throw new ApiError(404, 'This action is not available in the Strix Content Studio.');
  };

  return {
    async api(path, options) {
      try {
        return await route(path, options);
      } catch (error) {
        throw friendly(error);
      }
    },
    dispose() {
      stopAuth?.();
    },
  };
};
