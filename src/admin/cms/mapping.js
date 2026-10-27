/**
 * Maps the stored content (`data` of the `projects`, `case_studies` and
 * `blogs` rows, the former Firestore documents) to the record envelopes the
 * Strix Content Studio editor works on, and back. Only fields the public site
 * already reads are written, so the stored shape is unchanged. Pure functions.
 */
import { FILTERS, INDUSTRIES } from '../../components/projects/projectFilters.js';
import { PROCESS_DEFAULTS, PROCESS_MAX_STEPS } from '../../lib/processDefaults.js';
import { SERVICE_TITLES, normalizeServiceSlugs, serviceCategories } from '../../data/serviceCatalog.js';

export const TEMPLATES = ['design-development', 'production', 'mvp'];
export const FILTER_GROUPS = Object.keys(FILTERS);
export const TECHNOLOGY_NAMES = {
  design: ['Figma', 'Illustrator', 'Photoshop'],
  development: ['HTML5', 'CSS3', 'React', 'Next.js', 'JavaScript'],
  production: ['After Effects', 'Blender', 'Premiere Pro'],
};
export { FILTERS, INDUSTRIES };

/** Service pages a project can link to from its case study, grouped like the Services menu. */
export const SERVICES = serviceCategories.map(({ name, slugs }) => ({ name, services: slugs.map((slug) => ({ slug, title: SERVICE_TITLES[slug] })) }));
export { normalizeServiceSlugs };

// Limits follow what the public case-study and blog templates render.
export const LIMITS = { aboutImages: 3, conceptsFirst: 5, conceptsSecond: 4, responsiveImages: 8, results: 8, shippedItems: 12, processSteps: PROCESS_MAX_STEPS };
const CONCEPT_SLOTS = LIMITS.conceptsFirst + LIMITS.conceptsSecond;

const textPairs = (value) =>
  asArray(value)
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({ title: asString(item.title), description: asString(item.description) }));

/**
 * "The Process" steps for the editor: the case study's own steps, else its
 * template's standard steps (src/lib/processDefaults.js), as the website shows them.
 */
const processSteps = (stored, template) => {
  const own = textPairs(stored);
  return own.some((step) => step.title.trim()) ? own : textPairs(PROCESS_DEFAULTS[template]);
};

const asString = (value) => (typeof value === 'string' ? value : '');
const asArray = (value) => (Array.isArray(value) ? value : []);
const strings = (value) => asArray(value).filter((item) => typeof item === 'string');
const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const today = () => new Date().toISOString().slice(0, 10);

const splitList = (value) => asString(value).split(',').map((item) => item.trim()).filter(Boolean);
const images = (values, max) => strings(values).filter(Boolean).slice(0, max).map((src) => ({ src, alt: '' }));
const imageSources = (values, max) => asArray(values).map((image) => asString(image?.src).trim()).filter(Boolean).slice(0, max);
const pad = (values, length) => [...values, ...Array(Math.max(0, length - values.length)).fill('')].slice(0, length);

/* ------------------------------------------------------------------ URLs */

const hasUnsafeChars = (value) => [...value].some((char) => char.charCodeAt(0) < 32 || char === '\u007f' || char === '\\');

/** Mirrors `safeUrl` in src/lib/caseStudies.js: https, site-relative or base64 image data. */
export const isSafeUrl = (value, { image = false } = {}) => {
  const raw = asString(value).trim();
  if (!raw || hasUnsafeChars(raw)) return false;
  if (image && /^data:image\/(?:png|jpeg|jpg|gif|webp|avif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(raw)) return true;
  if (/^https:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return !url.username && !url.password;
    } catch {
      return false;
    }
  }
  return raw.startsWith('/') && !raw.startsWith('//');
};

/** Mirrors `youtubeId` in src/lib/caseStudies.js. */
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

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugFromLink = (link) => {
  const match = /^\/case-study\/([^/?#]+)\/?$/.exec(asString(link));
  return match ? decodeURIComponent(match[1]) : '';
};

/* -------------------------------------------------------------- projects */

const emptyFilters = () => Object.fromEntries(FILTER_GROUPS.map((group) => [group, []]));

const normalizeFilters = (filters) =>
  Object.fromEntries(FILTER_GROUPS.map((group) => [group, strings(filters?.[group])]));

/** Lower-case category keys used by the editor's list filters and labels. */
export const categoriesFromFilters = (filters) =>
  FILTER_GROUPS.filter((group) => strings(filters?.[group]).length).map((group) => group.toLowerCase());

/** Same fallback as `resolveTemplate` in src/lib/caseStudies.js. */
export const resolveTemplate = (caseData, filters) => {
  if (TEMPLATES.includes(caseData?.template)) return caseData.template;
  const f = normalizeFilters(filters);
  if (f.MVP.length) return 'mvp';
  if (f.Production.length && !f.Development.length) return 'production';
  return 'design-development';
};

const defaultFiltersFor = (template) => {
  const filters = emptyFilters();
  // A first sub-filter keeps a new project visible under its category tab.
  if (template === 'production') filters.Production = [FILTERS.Production[0]];
  if (template === 'mvp') filters.MVP = [FILTERS.MVP[0]];
  return filters;
};

/**
 * @param {{ id: string, data: Record<string, any> } | null} project
 * @param {{ id: string, data: Record<string, any> } | null} caseStudy
 */
export const projectToEditor = (project, caseStudy) => {
  const p = project?.data || {};
  const c = caseStudy?.data || {};
  const filters = normalizeFilters(p.filters);
  const template = resolveTemplate(c, filters);
  const slides = strings(c.conceptSlides);
  const shipped = c.shipped && typeof c.shipped === 'object' ? c.shipped : null;
  return {
    template,
    title: asString(p.title) || asString(c.projectTitle),
    caseTitle: asString(c.projectTitle),
    slug: slugFromLink(p.link),
    link: asString(p.link),
    externalLink: asString(p.externalLink),
    featured: p.featured === true,
    serviceSlugs: normalizeServiceSlugs(p.serviceSlugs),
    cardImage: asString(p.image),
    categoryText: asString(p.categoryText),
    cardIndustry: asString(p.industry),
    filters,
    categories: categoriesFromFilters(filters),
    services: splitList(c.client?.services),
    industry: asString(c.client?.industry),
    country: asString(c.client?.country),
    client: { name: asString(c.client?.name), logo: asString(c.client?.logo) },
    media: {
      type: asString(c.heroVideo) ? 'youtube' : 'image',
      thumbnail: asString(c.heroThumbnail),
      youtubeUrl: asString(c.heroVideo),
    },
    about: asString(c.aboutProject?.description),
    aboutImages: images(c.aboutProject?.images, LIMITS.aboutImages),
    experienceUrl: asString(c.aboutProject?.experienceLink),
    concepts: [images(slides.slice(0, LIMITS.conceptsFirst), LIMITS.conceptsFirst), images(slides.slice(LIMITS.conceptsFirst, CONCEPT_SLOTS), LIMITS.conceptsSecond)],
    responsiveImages: images(c.responsiveImages, LIMITS.responsiveImages),
    designSystem: { image: asString(c.designSystemImage) },
    technologies: {
      design: strings(c.technologies?.design),
      development: strings(c.technologies?.development),
      production: strings(c.technologies?.production),
    },
    process: processSteps(c.process, template),
    results: textPairs(c.results),
    shipped: {
      items: strings(shipped?.items),
      label: asString(shipped?.label),
      outcome: asString(shipped?.outcome),
      image: { src: asString(shipped?.image), alt: '' },
    },
  };
};

/** Project-card fields (the `projects` document). */
export const projectCardFields = (data) => ({
  title: asString(data.title).trim(),
  categoryText: asString(data.categoryText).trim(),
  industry: asString(data.cardIndustry),
  image: asString(data.cardImage).trim(),
  link: SLUG.test(asString(data.slug)) ? `/case-study/${data.slug}` : asString(data.link),
  externalLink: asString(data.externalLink).trim(),
  filters: normalizeFilters(data.filters),
  featured: data.featured === true,
  serviceSlugs: normalizeServiceSlugs(data.serviceSlugs),
});

/** Case-study fields grouped into the sections the previous admin saved independently. */
export const caseStudySections = (data, { includeTemplate = false } = {}) => {
  const results = asArray(data.results)
    .map((result) => ({ title: asString(result?.title).trim(), description: asString(result?.description).trim() }))
    .filter((result) => result.title || result.description);
  const steps = textPairs(data.process)
    .map((step) => ({ title: step.title.trim(), description: step.description.trim() }))
    .filter((step) => step.title || step.description);
  const sections = {
    basic: { projectTitle: asString(data.caseTitle).trim() },
    hero: {
      heroVideo: data.media?.type === 'youtube' ? asString(data.media?.youtubeUrl).trim() : '',
      heroThumbnail: asString(data.media?.thumbnail).trim(),
    },
    client: {
      client: {
        name: asString(data.client?.name).trim(),
        logo: asString(data.client?.logo).trim(),
        industry: asString(data.industry).trim(),
        country: asString(data.country).trim(),
        services: strings(data.services).map((item) => item.trim()).filter(Boolean).join(', '),
      },
    },
    about: {
      aboutProject: {
        description: asString(data.about),
        experienceLink: asString(data.experienceUrl).trim(),
        images: imageSources(data.aboutImages, LIMITS.aboutImages),
      },
    },
    concepts: {
      conceptSlides: [
        ...pad(imageSources(data.concepts?.[0], LIMITS.conceptsFirst), LIMITS.conceptsFirst),
        ...pad(imageSources(data.concepts?.[1], LIMITS.conceptsSecond), LIMITS.conceptsSecond),
      ],
    },
    design: { designSystemImage: asString(data.designSystem?.image).trim() },
    responsive: { responsiveImages: pad(imageSources(data.responsiveImages, LIMITS.responsiveImages), LIMITS.responsiveImages) },
    tech: {
      technologies: {
        design: strings(data.technologies?.design),
        development: strings(data.technologies?.development),
        production: strings(data.technologies?.production),
      },
    },
    // The template's standard steps are not stored, so they keep following src/lib/processDefaults.js.
    process: { process: same(steps, PROCESS_DEFAULTS[data.template] || []) ? [] : steps },
    results: { results },
  };
  if (data.template === 'mvp') {
    sections.shipped = {
      shipped: {
        items: strings(data.shipped?.items).map((item) => item.trim()).filter(Boolean),
        label: asString(data.shipped?.label).trim(),
        outcome: asString(data.shipped?.outcome).trim(),
        image: asString(data.shipped?.image?.src).trim(),
      },
    };
  }
  if (includeTemplate) sections.template = { template: data.template };
  return sections;
};

const hasText = (value) =>
  typeof value === 'string' ? Boolean(value.trim()) : value && typeof value === 'object' ? Object.values(value).some(hasText) : false;

const caseStudyIsEmpty = (sections) => !Object.entries(sections).some(([name, fields]) => name !== 'template' && hasText(fields));

/**
 * Work out the minimal writes for an edited project record.
 * @param {Record<string, any>} edited editor data
 * @param {Record<string, any>} original editor data as loaded (or a blank record)
 * @param {{ isNew?: boolean, hasCaseStudy: boolean, hasProject?: boolean, templateStored?: boolean }} context
 */
export const projectChanges = (edited, original, { isNew = false, hasCaseStudy, hasProject = true, templateStored = false }) => {
  const before = projectCardFields(original);
  const after = projectCardFields(edited);
  const card = {};
  if (hasProject) for (const key of Object.keys(after)) if (isNew || !same(before[key], after[key])) card[key] = after[key];
  // Store the template on case studies created here; existing ones keep their stored or derived template.
  const includeTemplate = !hasCaseStudy || templateStored;
  const beforeSections = caseStudySections(original, { includeTemplate });
  const afterSections = caseStudySections(edited, { includeTemplate });
  const sections = {};
  for (const [name, fields] of Object.entries(afterSections)) if (!same(beforeSections[name], fields)) sections[name] = fields;
  const createCaseStudy = !hasCaseStudy && !caseStudyIsEmpty(afterSections);
  if (createCaseStudy) Object.assign(sections, afterSections);
  return { card, sections, createCaseStudy };
};

/* ----------------------------------------------------------------- blogs */

const BLOCK_TO_EDITOR = {
  paragraph: (block) => ({ type: 'paragraph', text: asString(block.content) }),
  subheading: (block) => ({ type: 'heading', text: asString(block.content) }),
  keypoints: (block) => ({ type: 'list', items: strings(block.content) }),
  image: (block) => ({ type: 'image', src: asString(block.content) }),
};

export const BLOCK_TYPES = ['paragraph', 'heading', 'list', 'image'];

const blockToStored = (block, index) => {
  const id = block._id ?? Date.now() + index;
  if (block.type === 'legacy') return clone(block._raw);
  if (block.type === 'heading') return { id, type: 'subheading', content: asString(block.text) };
  if (block.type === 'list') return { id, type: 'keypoints', content: strings(block.items) };
  if (block.type === 'image') return { id, type: 'image', content: asString(block.src).trim() };
  return { id, type: 'paragraph', content: asString(block.text) };
};

const EMPTY_AUTHOR = { name: '', role: '', bio: '', avatar: '', linkedin: '', email: '' };

export const articleToEditor = (blog) => {
  const b = blog?.data || {};
  const author = { ...EMPTY_AUTHOR, ...(b.author && typeof b.author === 'object' ? b.author : {}) };
  return {
    title: asString(b.headerText),
    cardTitle: asString(b.topic),
    slug: blog?.id || '',
    excerpt: asString(b.excerpt),
    category: asString(b.tag),
    date: asString(b.date),
    readTime: Number.isFinite(b.readTime) && b.readTime > 0 ? b.readTime : '',
    cover: { src: asString(b.detailsImage), alt: '' },
    cardImage: asString(b.image),
    author: {
      name: asString(author.name),
      role: asString(author.role),
      bio: asString(author.bio),
      avatar: { src: asString(author.avatar), alt: '' },
      linkedin: asString(author.linkedin),
      email: asString(author.email),
    },
    body: asArray(b.content).map((block) => {
      const toEditor = block && BLOCK_TO_EDITOR[block.type];
      // Unknown block shapes are kept verbatim so saving never drops stored content.
      const mapped = toEditor ? toEditor(block) : { type: 'legacy', _raw: clone(block) };
      return { ...mapped, _id: block?.id };
    }),
  };
};

export const articleFields = (data, { hadAuthor = true, hadReadTime = true } = {}) => {
  const author = {
    name: asString(data.author?.name).trim(),
    role: asString(data.author?.role).trim(),
    bio: asString(data.author?.bio).trim(),
    avatar: asString(data.author?.avatar?.src).trim(),
    linkedin: asString(data.author?.linkedin).trim(),
    email: asString(data.author?.email).trim(),
  };
  const fields = {
    headerText: asString(data.title).trim(),
    topic: asString(data.cardTitle).trim(),
    excerpt: asString(data.excerpt).trim(),
    tag: asString(data.category).trim(),
    date: asString(data.date),
    detailsImage: asString(data.cover?.src).trim(),
    image: asString(data.cardImage).trim(),
    content: asArray(data.body).map(blockToStored),
  };
  if (hadAuthor || Object.values(author).some(Boolean)) fields.author = author;
  const readTime = Number(data.readTime);
  // A blank reading time lets the site keep estimating it from the word count.
  if (Number.isFinite(readTime) && readTime > 0) fields.readTime = Math.round(readTime);
  else if (hadReadTime) fields.readTime = null;
  return fields;
};

/**
 * @param {{ isNew?: boolean, hadAuthor?: boolean, hadReadTime?: boolean }} context
 */
export const articleChanges = (edited, original, { isNew = false, ...context } = {}) => {
  const before = articleFields(original, context);
  const after = articleFields(edited, context);
  return Object.fromEntries(Object.entries(after).filter(([key, value]) => isNew || !same(before[key], value)));
};

export const blankArticle = (category) => ({
  title: 'Untitled article', cardTitle: '', slug: '', excerpt: '', category: category || 'Tips', date: today(), readTime: '',
  cover: { src: '', alt: '' }, cardImage: '',
  author: { name: '', role: '', bio: '', avatar: { src: '', alt: '' }, linkedin: '', email: '' },
  body: [{ type: 'paragraph', text: '' }],
});

export const blankProject = (template) => {
  const suffix = Date.now().toString(36);
  const filters = defaultFiltersFor(template);
  return {
    ...projectToEditor(null, null),
    template,
    process: processSteps([], template),
    title: 'Untitled project',
    slug: `untitled-project-${suffix}`,
    filters,
    categories: categoriesFromFilters(filters),
  };
};

/* ------------------------------------------------------------ validation */

const BLOG_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @returns {Array<{ field: string, message: string }>}
 */
export const validateProject = (data, { publish = false, otherSlugs = [], hasProject = true } = {}) => {
  const errors = [];
  const error = (field, message) => errors.push({ field, message });
  const image = (value, field) => { if (value && !isSafeUrl(value, { image: true })) error(field, 'Use an https:// image link or upload an image.'); };
  const link = (value, field) => { if (value && !/^https:\/\//i.test(value.trim())) error(field, 'Use a full https:// link.'); else if (value && !isSafeUrl(value)) error(field, 'This link is not valid.'); };

  if (hasProject) {
    if (!asString(data.title).trim()) error('data.title', 'Add a project title.');
    if (asString(data.title).length > 200) error('data.title', 'Keep the title under 200 characters.');
    if (!SLUG.test(asString(data.slug)) && !asString(data.link)) error('data.slug', 'Use lowercase words separated by hyphens.');
    if (data.slug && !SLUG.test(data.slug)) error('data.slug', 'Use lowercase words separated by hyphens.');
    if (data.slug && otherSlugs.includes(data.slug)) error('data.slug', 'Another project already uses this URL slug.');
    if (data.cardIndustry && !INDUSTRIES.includes(data.cardIndustry)) error('data.cardIndustry', 'Choose an industry from the list.');
    for (const group of FILTER_GROUPS) {
      for (const value of strings(data.filters?.[group])) if (!FILTERS[group].includes(value)) error('data.filters', `“${value}” is not a ${group} filter.`);
    }
    link(asString(data.externalLink), 'data.externalLink');
    image(data.cardImage, 'data.cardImage');
    if (publish && !asString(data.cardImage).trim()) error('data.cardImage', 'Add a portfolio card image. The website hides projects without one.');
  }
  image(data.media?.thumbnail, 'data.media.thumbnail');
  image(data.client?.logo, 'data.client.logo');
  image(data.designSystem?.image, 'data.designSystem.image');
  image(data.shipped?.image?.src, 'data.shipped.image.src');
  link(asString(data.experienceUrl), 'data.experienceUrl');
  if (data.media?.type === 'youtube' && data.media?.youtubeUrl && !youtubeId(data.media.youtubeUrl)) {
    error('data.media.youtubeUrl', 'Use a YouTube link such as https://www.youtube.com/watch?v=…');
  }
  const gallery = (values, field, max) => {
    const list = asArray(values);
    if (list.length > max) error(field, `Use up to ${max} images here.`);
    list.forEach((item, index) => image(item?.src, `${field}.${index}`));
  };
  gallery(data.aboutImages, 'data.aboutImages', LIMITS.aboutImages);
  gallery(data.concepts?.[0], 'data.concepts.0', LIMITS.conceptsFirst);
  gallery(data.concepts?.[1], 'data.concepts.1', LIMITS.conceptsSecond);
  gallery(data.responsiveImages, 'data.responsiveImages', LIMITS.responsiveImages);
  if (asArray(data.process).length > LIMITS.processSteps) error('data.process', `The website shows up to ${LIMITS.processSteps} process steps.`);
  asArray(data.process).forEach((step, index) => {
    if (asString(step?.description).trim() && !asString(step?.title).trim()) error(`data.process.${index}.title`, 'Give this step a title, or the website will skip it.');
  });
  if (asArray(data.results).length > LIMITS.results) error('data.results', `The website shows up to ${LIMITS.results} results.`);
  asArray(data.results).forEach((result, index) => {
    if (asString(result?.description).trim() && !asString(result?.title).trim()) error(`data.results.${index}.title`, 'Give this result a title, or the website will skip it.');
  });
  if (strings(data.shipped?.items).length > LIMITS.shippedItems) error('data.shipped.items', `The website shows up to ${LIMITS.shippedItems} deliverables.`);
  return errors;
};

export const validateArticle = (data, { publish = false } = {}) => {
  const errors = [];
  const error = (field, message) => errors.push({ field, message });
  const image = (value, field) => { if (value && !isSafeUrl(value, { image: true })) error(field, 'Use an https:// image link or upload an image.'); };
  if (!asString(data.title).trim()) error('data.title', 'Add an article title.');
  if (asString(data.title).length > 300) error('data.title', 'Keep the title under 300 characters.');
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) error('data.date', 'Use a valid date.');
  if (publish && !data.date) error('data.date', 'Add a publication date.');
  if (asString(data.category).length > 80) error('data.category', 'Keep the category short.');
  if (data.readTime !== '' && data.readTime !== undefined && data.readTime !== null) {
    const minutes = Number(data.readTime);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) error('data.readTime', 'Use a whole number of minutes, or leave it blank to estimate.');
  }
  image(data.cover?.src, 'data.cover.src');
  image(data.cardImage, 'data.cardImage');
  image(data.author?.avatar?.src, 'data.author.avatar.src');
  const email = asString(data.author?.email).trim();
  if (email && !BLOG_EMAIL.test(email)) error('data.author.email', 'Use a valid email address.');
  const linkedin = asString(data.author?.linkedin).trim();
  if (linkedin && !(/^https:\/\//i.test(linkedin) && isSafeUrl(linkedin))) error('data.author.linkedin', 'Use a full https:// link.');
  asArray(data.body).forEach((block, index) => {
    if (block?.type === 'image') image(block.src, `data.body.${index}.src`);
  });
  return errors;
};
