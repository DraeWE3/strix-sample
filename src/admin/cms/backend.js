/**
 * Neon (Data API + Neon Auth) and Cloudinary backend for the Strix Content
 * Studio. It answers the studio's `api(path, options)` calls (originally served
 * by the generated CMS's Python server) using the same tables, fields, status
 * values and upload preset as the public site. Row-level security limits
 * writes to users listed in the `admins` table (db/schema.sql).
 */
import { neonAdmin } from '../neonClient.js';
import { run } from '../../lib/neon.js';
import { uploadImage } from '../storage.js';
import {
  articleChanges, articleToEditor, blankArticle, blankProject, categoriesFromFilters,
  projectChanges, projectToEditor, validateArticle, validateProject,
} from './mapping.js';

const PROJECTS = 'projects';
const CASE_STUDIES = 'case_studies';
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

const CHANGED_ELSEWHERE = 'This item was changed elsewhere since you opened it. Reload it before saving again.';

const MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: 'The email or password is incorrect.',
  INVALID_EMAIL: 'Enter a valid email address.',
  USER_NOT_FOUND: 'The email or password is incorrect.',
  EMAIL_NOT_VERIFIED: 'Verify this email address before signing in.',
  'permission-denied': 'Your account is not allowed to make this change.',
  unauthenticated: 'Your session expired. Sign in again.',
  unavailable: 'The database is unreachable. Check your connection and try again.',
};

const STATUS = { 'permission-denied': 403, unauthenticated: 401, unavailable: 503 };

const friendly = (error) => {
  if (error instanceof ApiError) return error;
  const message = MESSAGES[error?.code] || error?.message || 'The request could not be completed.';
  return new ApiError(STATUS[error?.code] || 500, message);
};

/** Neon Auth (Better Auth) answers `{ data, error }`; turn its error into a studio message. */
const authFailure = (error) => {
  if (error?.status === 429) return new ApiError(429, 'Too many attempts. Wait a moment and try again.');
  if (MESSAGES[error?.code]) return new ApiError(401, MESSAGES[error.code]);
  if (!error?.status) return new ApiError(503, 'You appear to be offline. Check your connection and try again.');
  return new ApiError(401, error.message || 'Sign-in failed.');
};

const liveProjectUrl = (card, id) =>
  /^https?:\/\//.test(asString(card.externalLink)) ? card.externalLink : asString(card.link) || `/case-study/${id}`;

/** @param {{ client?: typeof neonAdmin }} [options] */
export const createBackend = ({ client = neonAdmin } = {}) => {
  /** @type {Map<string, { envelope: Record<string, any>, source: Record<string, any> }>} */
  const records = new Map();
  const uploads = [];
  let user = null;

  /* ------------------------------------------------------------- auth */

  const isAdmin = async () => (await run(client.rpc('is_admin'))) === true;

  // A session that is not on the allow-list is signed out, so the studio shows the sign-in form.
  const adopt = async (next) => {
    user = next || null;
    if (user && !(await isAdmin())) {
      await client.auth.signOut().catch(() => {});
      user = null;
      return false;
    }
    return true;
  };

  const authReady = client.auth
    .getSession()
    .then(({ data }) => adopt(data?.user))
    .catch((error) => {
      console.error('Could not restore the studio session:', error);
      user = null;
    });

  const sessionPayload = () => ({
    setupRequired: false,
    authenticated: Boolean(user),
    user: user ? { id: user.id, name: user.name || user.email, email: user.email } : null,
  });

  const requireUser = () => {
    if (!user) throw new ApiError(401, 'Sign in to continue.');
  };

  /* -------------------------------------------------------------- rows */

  const allRows = (table) => run(client.from(table).select('id, data'));

  const readRow = async (table, id) => {
    const [row] = await run(client.from(table).select('id, data').eq('id', id).limit(1));
    return row || null;
  };

  const insertRow = async (table, data) => {
    const [row] = await run(client.from(table).insert({ data }).select('id, data'));
    return row;
  };

  // Row-level security turns a refused update or delete into "no rows", not an error.
  const assertApplied = async (rows, conflictMessage) => {
    if (rows.length) return;
    if (!(await isAdmin())) throw new ApiError(403, MESSAGES['permission-denied']);
    throw new ApiError(409, conflictMessage);
  };

  /**
   * Merges `patch` into a row's data (a shallow merge, as Firestore's updateDoc
   * did). The write is conditional on the `updatedAt` it read, so a save that
   * lands in between is refused rather than overwritten.
   */
  const updateRow = async (table, id, patch) => {
    const current = await readRow(table, id);
    if (!current) throw new ApiError(409, 'This item was deleted elsewhere. Reload the page.');
    const stored = asString(current.data.updatedAt);
    const update = client.from(table).update({ data: { ...current.data, ...patch } }).eq('id', id);
    const guarded = stored ? update.eq('data->>updatedAt', stored) : update.is('data->>updatedAt', null);
    await assertApplied(await run(guarded.select('id')), CHANGED_ELSEWHERE);
  };

  /** Refuse to overwrite a row someone changed after it was loaded here. */
  const assertUnchanged = async (table, id, expectedUpdatedAt) => {
    if (!id) return;
    const row = await readRow(table, id);
    if (!row) throw new ApiError(409, 'This item was deleted elsewhere. Reload the page.');
    if (asString(row.data.updatedAt) !== expectedUpdatedAt) throw new ApiError(409, CHANGED_ELSEWHERE);
  };

  const deleteRow = async (table, id) => {
    await assertApplied(await run(client.from(table).delete().eq('id', id).select('id')), 'This item was already deleted. Reload the page.');
  };

  /* --------------------------------------------------------- envelopes */

  const projectEnvelope = ({ project, caseStudy, isNew = false, template }) => {
    const data = isNew ? blankProject(template) : projectToEditor(project, caseStudy);
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

  const loadAll = async () => {
    const [projects, cases, blogs] = await Promise.all([PROJECTS, CASE_STUDIES, BLOGS].map(allRows));
    const casesByProject = new Map();
    // The public page reads the first case study per project in id order.
    cases
      .slice()
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
      remember(projectEnvelope({ project, caseStudy: linked || null }));
    }
    for (const [projectId, list] of casesByProject) {
      // Case studies the website never shows: no project card, or a second one for the same card.
      list.slice(projectIds.has(projectId) ? 1 : 0).forEach((c) => remember(projectEnvelope({ project: null, caseStudy: c })));
    }
    blogs.forEach((blog) => remember(articleEnvelope({ blog })));
  };

  const reloadProject = async ({ projectId, caseId }) =>
    projectEnvelope({
      project: projectId ? await readRow(PROJECTS, projectId) : null,
      caseStudy: caseId ? await readRow(CASE_STUDIES, caseId) : null,
    });

  const reloadArticle = async (blogId) => {
    const blog = await readRow(BLOGS, blogId);
    if (!blog) throw new ApiError(404, 'This article no longer exists.');
    return articleEnvelope({ blog });
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

  /* ------------------------------------------------------------ writes */

  const sectionFields = (sections) => Object.assign({}, ...Object.values(sections));

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
    // Check both rows before writing either, so a conflict never leaves a half-saved project.
    await assertUnchanged(PROJECTS, source.projectId, source.projectUpdatedAt);
    await assertUnchanged(CASE_STUDIES, source.caseId, source.caseUpdatedAt);

    const stamp = now();
    let { projectId, caseId } = source;
    if (source.isNew) {
      projectId = (await insertRow(PROJECTS, { ...card, status: 'draft', createdAt: stamp, updatedAt: stamp })).id;
    } else if (projectId && Object.keys(card).length) {
      await updateRow(PROJECTS, projectId, { ...card, updatedAt: stamp });
    }
    if (createCaseStudy) {
      // A first case study follows the card's status, so a live card never links to a hidden page.
      const status = envelope.status === 'published' ? 'published' : 'draft';
      caseId = (await insertRow(CASE_STUDIES, { projectId, status, ...sectionFields(sections), createdAt: stamp, updatedAt: stamp })).id;
    } else if (caseId && Object.keys(sections).length) {
      await updateRow(CASE_STUDIES, caseId, { ...sectionFields(sections), updatedAt: stamp });
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
      blogId = (await insertRow(BLOGS, { ...changes, status: 'draft', createdAt: stamp, updatedAt: stamp })).id;
    } else if (Object.keys(changes).length) {
      await assertUnchanged(BLOGS, blogId, source.updatedAt);
      await updateRow(BLOGS, blogId, { ...changes, updatedAt: stamp });
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
      await updateRow(BLOGS, source.blogId, { status });
      return remember(await reloadArticle(source.blogId));
    }
    if (envelope.orphan) throw new ApiError(409, 'Link this case study to a project card before publishing it.');
    await updateRow(PROJECTS, source.projectId, { status });
    if (source.caseId) await updateRow(CASE_STUDIES, source.caseId, { status });
    return remember(await reloadProject(source));
  };

  const remove = async (entry) => {
    const { envelope, source } = entry;
    if (!envelope.isNew) {
      if (envelope.kind === 'article') await deleteRow(BLOGS, source.blogId);
      else {
        if (source.caseId) await deleteRow(CASE_STUDIES, source.caseId);
        if (source.projectId) await deleteRow(PROJECTS, source.projectId);
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
      const { data, error } = await client.auth.signIn.email({ email: asString(body?.email).trim(), password: asString(body?.password) });
      if (error) throw authFailure(error);
      if (!(await adopt(data?.user))) throw new ApiError(403, 'This account is not on the studio allow-list. Ask an existing admin to add it.');
      return sessionPayload();
    }
    if (pathname === '/api/logout' && method === 'POST') {
      await client.auth.signOut();
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
        : projectEnvelope({ isNew: true, template: body?.data?.template, project: null, caseStudy: null }));
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
    dispose() {},
  };
};
