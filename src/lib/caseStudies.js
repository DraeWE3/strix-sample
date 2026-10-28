import { neon, run } from './neon';
import { PROJECTS_TABLE, caseStudyPath, isPublished, mapProject, projectHref } from './projects';
import { resolveProcess } from './processDefaults';
import { safeUrl } from './urls';
import { SERVICE_TITLES, serviceRoute } from '../data/serviceCatalog';

export { safeUrl };

export const CASE_STUDIES_TABLE = 'case_studies';

export const TEMPLATES = Object.freeze({
  DESIGN_DEVELOPMENT: 'design-development',
  PRODUCTION: 'production',
  MVP: 'mvp',
});

const TEMPLATE_VALUES = Object.values(TEMPLATES);
const CACHE_TTL = 60 * 1000;
const cache = new Map();

const asString = (value) => (typeof value === 'string' ? value : '');
const asArray = (value) => (Array.isArray(value) ? value : []);

/** @param {unknown} value */
export const youtubeId = (value) => {
  const raw = asString(value).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return '';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const parts = url.pathname.split('/').filter(Boolean);
    let id = '';
    if (host === 'youtu.be') id = parts[0];
    else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : '';
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : '';
  } catch {
    return '';
  }
};

/**
 * Template used to lay a case study out. A `template` field on the case study
 * wins; otherwise it follows the category filters of the linked project.
 * @param {Record<string, unknown>} data
 * @param {import('./projects').Project} project
 */
export const resolveTemplate = (data, project) => {
  if (TEMPLATE_VALUES.includes(data.template)) return data.template;
  const { filters } = project;
  if (filters.MVP.length) return TEMPLATES.MVP;
  if (filters.Production.length && !filters.Development.length) return TEMPLATES.PRODUCTION;
  return TEMPLATES.DESIGN_DEVELOPMENT;
};

const splitList = (value) =>
  asString(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toImage = (src, alt = '') => ({ src: safeUrl(src), alt });

const toImages = (values, alt) => asArray(values).map((src) => toImage(src, alt)).filter((image) => image.src);

const toStringList = (values) => asArray(values).filter((item) => typeof item === 'string' && item.trim());

/** First ~160 characters of `text`, cut at a word boundary. */
const summary = (text, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,.;:—-]+$/, '')}…`;
};

const mapShipped =(shipped, title) => {
  const items = toStringList(shipped?.items).slice(0, 12);
  if (!items.length) return null;
  return {
    items,
    label: asString(shipped.label) || title,
    outcome: asString(shipped.outcome),
    image: toImage(shipped.image, asString(shipped.label) || title),
  };
};

/**
 * Map a stored case study (plus its project) onto the record
 * shape consumed by the case-study templates.
 * @param {Record<string, any>} data
 * @param {import('./projects').Project} project
 */
export const mapCaseStudy = (data, project) => {
  const title = asString(data.projectTitle) || project.title;
  const about = asString(data.aboutProject?.description);
  const services = splitList(data.client?.services);
  const template = resolveTemplate(data, project);
  const filterLabels = Object.values(project.filters).flat();

  return {
    id: data.id,
    projectId: project.id,
    template,
    title,
    filters: project.filters,
    serviceLinks: project.serviceSlugs.map((slug) => ({ slug, label: SERVICE_TITLES[slug], href: serviceRoute(slug) })),
    services,
    industry: asString(data.client?.industry),
    country: asString(data.client?.country),
    client: { name: asString(data.client?.name), logo: safeUrl(data.client?.logo) },
    media: {
      thumbnail: safeUrl(data.heroThumbnail),
      alt: title,
      videoUrl: safeUrl(data.heroVideo, { allowData: false }),
      youtubeId: youtubeId(data.heroVideo),
    },
    about,
    aboutImages: toImages(asArray(data.aboutProject?.images).slice(0, 3), title),
    experienceUrl: safeUrl(data.aboutProject?.experienceLink, { allowData: false }),
    process: resolveProcess(data.process, template),
    concepts: [
      toImages(asArray(data.conceptSlides).slice(0, 5), `${title} concept`),
      toImages(asArray(data.conceptSlides).slice(5, 9), `${title} concept`),
    ],
    responsiveImages: toImages(data.responsiveImages, `${title} responsive screen`),
    designSystem: { image: toImage(data.designSystemImage, `${title} design system`) },
    technologies: {
      design: toStringList(data.technologies?.design),
      development: toStringList(data.technologies?.development),
      production: toStringList(data.technologies?.production),
    },
    shipped: mapShipped(data.shipped, title),
    results: asArray(data.results)
      .filter((result) => result?.title)
      .slice(0, 8)
      .map((result) => ({ title: asString(result.title), description: asString(result.description) })),
    canonicalPath: caseStudyPath(project),
    // Set in the studio's "Search & sharing" section; blank fields fall back in caseStudyMeta.
    seo: {
      title: asString(data.seo?.title).trim(),
      description: asString(data.seo?.description).trim() || summary(about) || filterLabels.join(', '),
      image: safeUrl(data.heroThumbnail),
    },
  };
};

const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

const findProject = async (slug, client) => {
  const [bySlug] = await run(
    client.from(PROJECTS_TABLE).select('id, data').eq('link', `/case-study/${slug}`).eq('status', 'published').limit(1)
  );
  if (bySlug) return mapProject(bySlug.id, bySlug.data);
  if (!SAFE_ID.test(slug)) return null;
  // Row-level security hides unpublished cards, so a draft reads as missing.
  const [byId] = await run(client.from(PROJECTS_TABLE).select('id, data').eq('id', slug).limit(1));
  return byId ? mapProject(byId.id, byId.data) : null;
};

/**
 * Reads one published case study. `client` lets the build pass its own Data API reader.
 * @param {string} slug
 * @param {import('@neondatabase/postgrest-js').NeonPostgrestClient} [client]
 */
export const fetchCaseStudy = async (slug, client = neon()) => {
  const project = await findProject(slug, client);
  if (!project || !isPublished(project)) return { status: 'not-found' };

  // The first published case study in id order, as the studio pairs them.
  const [row] = await run(
    client.from(CASE_STUDIES_TABLE).select('id, data').eq('project_id', project.id).eq('status', 'published').order('id').limit(1)
  );
  if (!row) return { status: 'not-found' };

  return { status: 'ready', project, record: mapCaseStudy({ ...row.data, id: row.id }, project) };
};

/**
 * Head metadata for a case study page, shared by the page and the prerender build.
 * @param {ReturnType<typeof mapCaseStudy>} record
 */
export const caseStudyMeta = (record) => ({
  path: record.canonicalPath,
  title: record.seo.title || `${record.title} — Case Study`,
  description:
    record.seo.description ||
    `Explore the ${record.title} case study by Strix Production: the challenge, our design and development approach, and the results delivered.`,
  type: 'article',
  image: record.seo.image,
});

/**
 * Resolve a published case study by the slug used in `/case-study/:slug`.
 * Unpublished or missing projects resolve to `{ status: 'not-found' }`.
 * Results are cached briefly so revisits do not repeat the database reads.
 * @param {string} slug
 */
export const loadCaseStudy = (slug) => {
  const cached = cache.get(slug);
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.promise;
  const promise = fetchCaseStudy(slug);
  cache.set(slug, { at: Date.now(), promise });
  promise.catch(() => cache.delete(slug));
  return promise;
};

/**
 * Next Project link, derived from the shared live projects list.
 * @param {import('./projects').Project[]} projects published projects, newest first
 * @param {import('./projects').Project} current
 */
export const nextProjectHref = (projects, current) => {
  const index = projects.findIndex((project) => project.id === current.id);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  return next && next.id !== current.id ? projectHref(next) : '';
};
