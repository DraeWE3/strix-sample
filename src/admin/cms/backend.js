/**
 * Firestore, Firebase Auth and Cloudinary backend for the Strix Content Studio.
 * It answers the studio's `api(path, options)` calls (originally served by the
 * generated CMS's Python server) using the same collections, fields, status
 * values and upload preset as the previous admin panel and the public site.
 */
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocFromServer, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig.js';
import { uploadImage } from '../storage.js';
import {
  articleChanges, articleToEditor, blankArticle, blankProject, categoriesFromFilters,
  chunkBelongsTo, projectChanges, projectToEditor, reconstructCaseStudy, splitSection,
  validateArticle, validateProject,
} from './mapping.js';

const PROJECTS = 'projects';
const CASE_STUDIES = 'caseStudies';
const BLOGS = 'blogs';
const SITE_URL = 'https://www.strixproduction.com';
const PINNED_TOPICS = ['Tips', 'News'];

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
  unavailable: 'The database is unreachable. Check your connection and try again.',
};

const friendly = (error) => {
  if (error instanceof ApiError) return error;
  const message = FIREBASE_MESSAGES[error?.code] || error?.message || 'The request could not be completed.';
  return new ApiError(error?.code === 'permission-denied' ? 403 : 500, message);
};

const liveProjectUrl = (card, id) =>
  /^https?:\/\//.test(asString(card.externalLink)) ? card.externalLink : asString(card.link) || `/case-study/${id}`;

export const createBackend = () => {
  /** @type {Map<string, { envelope: Record<string, any>, source: Record<string, any> }>} */
  const records = new Map();
  const uploads = [];
  let user = null;
  let stopAuth = null;
  const authReady = new Promise((resolve) => {
    stopAuth = onAuthStateChanged(auth, (next) => {
      user = next;
      resolve();
    });
  });

  const sessionPayload = () => ({
    setupRequired: false,
    authenticated: Boolean(user),
    user: user ? { id: user.uid, name: user.displayName || user.email, email: user.email } : null,
  });

  const requireUser = () => {
    if (!user) throw new ApiError(401, 'Sign in to continue.');
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

  const loadChunks = async (caseId) => snapshotDocs(await getDocs(collection(db, CASE_STUDIES, caseId, 'chunks')));

  const loadAll = async () => {
    const [projects, cases, blogs] = (
      await Promise.all([PROJECTS, CASE_STUDIES, BLOGS].map((name) => getDocs(collection(db, name))))
    ).map(snapshotDocs);
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

  /** Refuse to overwrite a document someone changed after it was loaded here. */
  const assertUnchanged = async (collectionName, id, expectedUpdatedAt) => {
    if (!id) return;
    const snapshot = await getDocFromServer(doc(db, collectionName, id));
    if (!snapshot.exists()) throw new ApiError(409, 'This item was deleted elsewhere. Reload the page.');
    if (asString(snapshot.data().updatedAt) !== expectedUpdatedAt) {
      throw new ApiError(409, 'This item was changed elsewhere since you opened it. Reload it before saving again.');
    }
  };

  const otherProjectSlugs = (id) =>
    [...records.values()]
      .filter(({ envelope }) => envelope.kind === 'project' && envelope.id !== id && !envelope.orphan)
      .map(({ envelope }) => envelope.data.slug)
      .filter(Boolean);

  /* ------------------------------------------------------------ writes */

  const writeSections = async (caseId, sections, existingChunks) => {
    const main = {};
    const added = [];
    const stale = [];
    for (const [name, fields] of Object.entries(sections)) {
      const split = splitSection(name, fields);
      Object.assign(main, split.main);
      added.push(...split.chunks);
      stale.push(...existingChunks.filter((chunk) => chunkBelongsTo(name, chunk.sectionName)));
    }
    const stamp = now();
    // New chunks go in before old ones are removed, so a failed save never loses images.
    for (const chunk of added) {
      await addDoc(collection(db, CASE_STUDIES, caseId, 'chunks'), { ...chunk, createdAt: stamp, updatedAt: stamp });
    }
    await updateDoc(doc(db, CASE_STUDIES, caseId), { ...main, updatedAt: stamp });
    await Promise.all(stale.map((chunk) => deleteDoc(doc(db, CASE_STUDIES, caseId, 'chunks', chunk.id))));
  };

  const saveProject = async (entry, data) => {
    const { source, envelope } = entry;
    data.categories = categoriesFromFilters(data.filters);
    const fields = validateProject(data, { otherSlugs: otherProjectSlugs(envelope.id), hasProject: !envelope.orphan });
    if (fields.length) throw new ApiError(422, 'Review the highlighted fields before saving.', fields);

    const { card, sections, createCaseStudy } = projectChanges(data, source.original, {
      isNew: source.isNew,
      hasCaseStudy: Boolean(source.caseId),
      hasProject: !envelope.orphan,
      templateStored: source.templateStored,
    });
    await assertUnchanged(PROJECTS, source.projectId, source.projectUpdatedAt);
    await assertUnchanged(CASE_STUDIES, source.caseId, source.caseUpdatedAt);

    const stamp = now();
    let { projectId, caseId } = source;
    if (source.isNew) {
      const ref = await addDoc(collection(db, PROJECTS), { ...card, status: 'draft', createdAt: stamp, updatedAt: stamp });
      projectId = ref.id;
    } else if (projectId && Object.keys(card).length) {
      await updateDoc(doc(db, PROJECTS, projectId), { ...card, updatedAt: stamp });
    }
    if (createCaseStudy) {
      // A first case study follows the card's status, so a live card never links to a hidden page.
      const ref = await addDoc(collection(db, CASE_STUDIES), {
        projectId, status: envelope.status === 'published' ? 'published' : 'draft', createdAt: stamp, updatedAt: stamp,
      });
      caseId = ref.id;
      await writeSections(caseId, sections, []);
    } else if (caseId && Object.keys(sections).length) {
      await writeSections(caseId, sections, source.chunks);
    }
    records.delete(envelope.id);
    return remember(await reloadProject({ projectId, caseId }));
  };

  const saveArticle = async (entry, data) => {
    const { source, envelope } = entry;
    const fields = validateArticle(data);
    if (fields.length) throw new ApiError(422, 'Review the highlighted fields before saving.', fields);
    const changes = articleChanges(data, source.original, { isNew: source.isNew, hadAuthor: source.hadAuthor, hadReadTime: source.hadReadTime });
    const stamp = now();
    let { blogId } = source;
    if (source.isNew) {
      const ref = await addDoc(collection(db, BLOGS), { ...changes, status: 'draft', createdAt: stamp, updatedAt: stamp });
      blogId = ref.id;
    } else if (Object.keys(changes).length) {
      await assertUnchanged(BLOGS, blogId, source.updatedAt);
      await updateDoc(doc(db, BLOGS, blogId), { ...changes, updatedAt: stamp });
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
    // Status-only writes, exactly as the previous admin's publish toggle.
    if (envelope.kind === 'article') {
      await updateDoc(doc(db, BLOGS, source.blogId), { status });
      return remember(await reloadArticle(source.blogId));
    }
    if (envelope.orphan) throw new ApiError(409, 'Link this case study to a project card before publishing it.');
    await updateDoc(doc(db, PROJECTS, source.projectId), { status });
    if (source.caseId) await updateDoc(doc(db, CASE_STUDIES, source.caseId), { status });
    return remember(await reloadProject(source));
  };

  const remove = async (entry) => {
    const { envelope, source } = entry;
    if (!envelope.isNew) {
      if (envelope.kind === 'article') await deleteDoc(doc(db, BLOGS, source.blogId));
      else {
        if (source.caseId) {
          const chunks = await getDocs(collection(db, CASE_STUDIES, source.caseId, 'chunks'));
          await Promise.all(chunks.docs.map((chunk) => deleteDoc(chunk.ref)));
          await deleteDoc(doc(db, CASE_STUDIES, source.caseId));
        }
        if (source.projectId) await deleteDoc(doc(db, PROJECTS, source.projectId));
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
      return sessionPayload();
    }
    if (pathname === '/api/login' && method === 'POST') {
      const credential = await signInWithEmailAndPassword(auth, asString(body?.email).trim(), asString(body?.password));
      user = credential.user;
      return sessionPayload();
    }
    if (pathname === '/api/logout' && method === 'POST') {
      await signOut(auth);
      user = null;
      records.clear();
      return { ok: true };
    }
    requireUser();
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
        return entry.envelope.kind === 'article' ? saveArticle(entry, data) : saveProject(entry, data);
      }
      if (action === 'publish' && method === 'POST') return setStatus(entry, 'published');
      if (action === 'unpublish' && method === 'POST') return setStatus(entry, 'draft');
      if (action === 'trash' && method === 'POST') return remove(entry);
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
