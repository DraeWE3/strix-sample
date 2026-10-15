import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../admin/firebaseconfig';
import { PROJECTS_COLLECTION, isPublished, mapProject, projectHref } from './projects';

export const CASE_STUDIES_COLLECTION = 'caseStudies';

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

const hasUnsafeChars = (value) => [...value].some((char) => char.charCodeAt(0) < 32 || char === '\u007f' || char === '\\');

/**
 * Accepts https URLs, site-relative paths and base64 image data URIs.
 * @param {unknown} value
 * @returns {string}
 */
export const safeUrl = (value) => {
  const raw = asString(value).trim();
  if (!raw || hasUnsafeChars(raw)) return '';
  if (/^data:image\/(?:png|jpeg|jpg|gif|webp|avif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(raw)) return raw;
  if (/^https:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.username || url.password ? '' : url.href;
    } catch {
      return '';
    }
  }
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '';
};

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
 * document wins; otherwise it follows the category filters of the linked project.
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

/**
 * Case-study sections that are too large for one Firestore document are stored
 * in `caseStudies/{id}/chunks`; fold them back into the main document.
 * @param {Record<string, any>} mainData
 * @param {Array<{ sectionName?: string, data?: Record<string, any> }>} chunks
 */
export const reconstructSectionData = (mainData, chunks) => {
  const result = {
    ...mainData,
    aboutProject: { ...mainData.aboutProject, images: asArray(mainData.aboutProject?.images).slice() },
    client: { ...mainData.client },
    processCards: asArray(mainData.processCards).slice(),
    conceptSlides: asArray(mainData.conceptSlides).slice(),
    responsiveImages: asArray(mainData.responsiveImages).slice(),
  };

  chunks.forEach(({ sectionName, data }) => {
    if (!sectionName || !data) return;
    const hasIndex = data.index !== undefined;
    if (sectionName === 'hero_thumbnail') result.heroThumbnail = data.heroThumbnail;
    else if (sectionName === 'client_logo') result.client.logo = data.logo;
    else if (sectionName === 'design_image') result.designSystemImage = data.designSystemImage;
    else if (sectionName.startsWith('about_image_') && hasIndex && data.image) result.aboutProject.images[data.index] = data.image;
    else if (sectionName.startsWith('process_card_') && hasIndex && data.card) result.processCards[data.index] = data.card;
    else if (sectionName.startsWith('concept_slide_') && hasIndex && data.slide) result.conceptSlides[data.index] = data.slide;
    else if (sectionName.startsWith('responsive_image_') && hasIndex && data.image) result.responsiveImages[data.index] = data.image;
  });

  return result;
};

const splitList = (value) =>
  asString(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toImage = (src, alt = '') => ({ src: safeUrl(src), alt });

const toImages = (values, alt) => asArray(values).map((src) => toImage(src, alt)).filter((image) => image.src);

const toStringList = (values) => asArray(values).filter((item) => typeof item === 'string' && item.trim());

const mapShipped = (shipped, title) => {
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
 * Map a reconstructed Firestore case study (plus its project) onto the record
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
    tagLabels: template === TEMPLATES.DESIGN_DEVELOPMENT ? services : [],
    services,
    industry: asString(data.client?.industry),
    country: asString(data.client?.country),
    client: { name: asString(data.client?.name), logo: safeUrl(data.client?.logo) },
    media: {
      thumbnail: safeUrl(data.heroThumbnail),
      alt: title,
      videoUrl: safeUrl(data.heroVideo),
      youtubeId: youtubeId(data.heroVideo),
    },
    about,
    aboutImages: toImages(asArray(data.aboutProject?.images).slice(0, 3), title),
    experienceUrl: safeUrl(data.aboutProject?.experienceLink),
    process: asArray(data.processCards)
      .filter((card) => card?.title)
      .slice(0, 8)
      .map((card) => ({
        title: asString(card.title),
        description: toStringList(card.details).join(' '),
      })),
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
    seo: {
      title,
      description: about.slice(0, 160) || filterLabels.join(', '),
      image: safeUrl(data.heroThumbnail),
    },
  };
};

const findProject = async (slug) => {
  const bySlug = await getDocs(
    query(collection(db, PROJECTS_COLLECTION), where('link', '==', `/case-study/${slug}`), limit(1))
  );
  if (!bySlug.empty) return mapProject(bySlug.docs[0].id, bySlug.docs[0].data());
  const byId = await getDoc(doc(db, PROJECTS_COLLECTION, slug));
  return byId.exists() ? mapProject(byId.id, byId.data()) : null;
};

const fetchCaseStudy = async (slug) => {
  const project = await findProject(slug);
  if (!project || !isPublished(project)) return { status: 'not-found' };

  const snapshot = await getDocs(
    query(collection(db, CASE_STUDIES_COLLECTION), where('projectId', '==', project.id), limit(1))
  );
  if (snapshot.empty) return { status: 'not-found' };

  const [caseDoc] = snapshot.docs;
  if (caseDoc.data().status !== 'published') return { status: 'not-found' };
  const chunks = await getDocs(collection(db, CASE_STUDIES_COLLECTION, caseDoc.id, 'chunks'));
  const data = reconstructSectionData(
    { id: caseDoc.id, ...caseDoc.data() },
    chunks.docs.map((chunk) => chunk.data())
  );

  return { status: 'ready', project, record: mapCaseStudy(data, project) };
};

/**
 * Resolve a published case study by the slug used in `/case-study/:slug`.
 * Unpublished or missing projects resolve to `{ status: 'not-found' }`.
 * Results are cached briefly so revisits do not repeat the Firestore reads.
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
