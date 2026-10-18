import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { PROJECTS_COLLECTION, caseStudyPath, isPublished, mapProject, projectHref } from './projects';
import { safeUrl } from './urls';

export { safeUrl };

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
const chunkOrder = (a, b) =>
  String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.id || '').localeCompare(String(b.id || ''));

export const reconstructSectionData = (mainData, chunks) => {
  const result = {
    ...mainData,
    aboutProject: { ...mainData.aboutProject, images: asArray(mainData.aboutProject?.images).slice() },
    client: { ...mainData.client },
    processCards: asArray(mainData.processCards).slice(),
    conceptSlides: asArray(mainData.conceptSlides).slice(),
    responsiveImages: asArray(mainData.responsiveImages).slice(),
  };

  // Oldest first, so the newest write of a section wins over any stray older chunk.
  chunks.slice().sort(chunkOrder).forEach(({ sectionName, data }) => {
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

const PROCESS_COPY = {
  discovery: 'We define your core idea, map user journeys, and create wireframes that lock your product vision with direction.',
  design: 'High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks and feels right before development.',
  development: 'We develop the MVP with clean, scalable code & refine through quick sprints to keep results aligned with the vision.',
  launch: 'Before going live, we stress-test every feature for smooth performance, scalability, and future expansion.',
};

// The Process copy is fixed per template to match the Figma designs (nodes 894:4788, 3534:8076, 3534:8137).
const FIGMA_PROCESS = {
  [TEMPLATES.DESIGN_DEVELOPMENT]: [
    { title: 'Discovery & Wireframes', description: PROCESS_COPY.discovery },
    { title: 'Design & Validation', description: PROCESS_COPY.design },
    { title: 'Development & Iterations', description: PROCESS_COPY.development },
    { title: 'Test, Launch & Scale', description: PROCESS_COPY.launch },
  ],
  [TEMPLATES.PRODUCTION]: [
    { title: 'Discovery & Brief', description: PROCESS_COPY.discovery },
    { title: 'Pre-Production & Creative Direction', description: 'High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks right.' },
    { title: 'Production & Editing', description: PROCESS_COPY.development },
    { title: 'Delivery & Distribution', description: PROCESS_COPY.launch },
  ],
};
FIGMA_PROCESS[TEMPLATES.MVP] = FIGMA_PROCESS[TEMPLATES.DESIGN_DEVELOPMENT];

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
      videoUrl: safeUrl(data.heroVideo, { allowData: false }),
      youtubeId: youtubeId(data.heroVideo),
    },
    about,
    aboutImages: toImages(asArray(data.aboutProject?.images).slice(0, 3), title),
    experienceUrl: safeUrl(data.aboutProject?.experienceLink, { allowData: false }),
    process: FIGMA_PROCESS[template] || [],
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
    seo: {
      title,
      description: about.slice(0, 160) || filterLabels.join(', '),
      image: safeUrl(data.heroThumbnail),
    },
  };
};

const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

const unavailable = () =>
  Object.assign(new Error('The case study could not be loaded right now. Check your connection and try again.'), {
    code: 'unavailable',
  });

const denied = (error) => error?.code === 'permission-denied';

// An empty answer that came only from the local cache proves nothing.
const confirmedEmpty = (snapshot) => {
  if (!snapshot.empty) return false;
  if (snapshot.metadata?.fromCache) throw unavailable();
  return true;
};

const findProject = async (slug, { db: firestore, getDocs: readDocs, getDoc: readDoc }) => {
  const bySlug = await readDocs(
    query(
      collection(firestore, PROJECTS_COLLECTION),
      where('link', '==', `/case-study/${slug}`),
      where('status', '==', 'published'),
      limit(1)
    )
  );
  if (!confirmedEmpty(bySlug)) return mapProject(bySlug.docs[0].id, bySlug.docs[0].data());
  if (!SAFE_ID.test(slug)) return null;
  try {
    const byId = await readDoc(doc(firestore, PROJECTS_COLLECTION, slug));
    return byId.exists() ? mapProject(byId.id, byId.data()) : null;
  } catch (error) {
    // Security rules refuse direct reads of unpublished cards.
    if (denied(error)) return null;
    throw error;
  }
};

/**
 * Reads one published case study. `source` lets the build pass server-only
 * reads against its own Firestore instance.
 * @param {string} slug
 * @param {{ db: import('firebase/firestore').Firestore, getDocs: typeof getDocs, getDoc: typeof getDoc }} [source]
 */
export const fetchCaseStudy = async (slug, source = { db, getDocs, getDoc }) => {
  const project = await findProject(slug, source);
  if (!project || !isPublished(project)) return { status: 'not-found' };

  const snapshot = await source.getDocs(
    query(
      collection(source.db, CASE_STUDIES_COLLECTION),
      where('projectId', '==', project.id),
      where('status', '==', 'published'),
      limit(1)
    )
  );
  if (confirmedEmpty(snapshot)) return { status: 'not-found' };

  const [caseDoc] = snapshot.docs;
  const chunks = await source.getDocs(collection(source.db, CASE_STUDIES_COLLECTION, caseDoc.id, 'chunks'));
  const data = reconstructSectionData(
    { id: caseDoc.id, ...caseDoc.data() },
    chunks.docs.map((chunk) => ({ id: chunk.id, ...chunk.data() }))
  );

  return { status: 'ready', project, record: mapCaseStudy(data, project) };
};

/**
 * Head metadata for a case study page, shared by the page and the prerender build.
 * @param {ReturnType<typeof mapCaseStudy>} record
 */
export const caseStudyMeta = (record) => ({
  path: record.canonicalPath,
  title: `${record.title} — Case Study`,
  description:
    record.seo.description ||
    `Explore the ${record.title} case study by Strix Production: the challenge, our design and development approach, and the results delivered.`,
  type: 'article',
  image: record.seo.image,
});

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
