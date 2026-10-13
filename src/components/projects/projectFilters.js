export const PAGE_SIZE = 6;

export const FILTERS = {
  Design: ['UI/UX', 'Graphics', 'Branding', 'App Design', 'Web Design'],
  Development: ['Website', 'Web-app', 'Application', 'E-commerce', 'Landing page'],
  Production: ['3D', 'Promos', 'Long Format', 'Reels/shorts', 'Motion Graphics'],
  MVP: ['SaaS', 'Web MVP', 'Mobile MVP', 'AI Product', 'Prototype'],
};

export const INDUSTRIES = [
  'AI & technology',
  'Business services',
  'Consumer & lifestyle',
  'eCommerce & retail',
  'Education',
  'Finance & fintech',
  'Gaming & immersive',
  'Healthcare & wellness',
  'Media & entertainment',
];

export const CATEGORIES = ['All', ...Object.keys(FILTERS)];

const typesFor = (category) => (FILTERS[category] ? FILTERS[category] : Object.values(FILTERS).flat());

export const normalizeState = ({ category, type, industry, shown } = {}) => {
  const validCategory = CATEGORIES.includes(category) ? category : 'All';
  const validType = typesFor(validCategory).includes(type) ? type : '';
  const validIndustry = INDUSTRIES.includes(industry) ? industry : '';
  const requested = Number(shown);
  const limit = Number.isFinite(requested) && requested > PAGE_SIZE
    ? Math.floor(requested / PAGE_SIZE) * PAGE_SIZE
    : PAGE_SIZE;
  return { category: validCategory, type: validType, industry: validIndustry, limit };
};

export const stateFromSearch = (params) => normalizeState({
  category: params.get('category'),
  type: params.get('type'),
  industry: params.get('industry'),
  shown: params.get('shown'),
});

export const searchFromState = ({ category, type, industry, limit }) => {
  const params = {};
  if (category !== 'All') params.category = category;
  if (type) params.type = type;
  if (industry) params.industry = industry;
  if (limit > PAGE_SIZE) params.shown = String(limit);
  return params;
};

export const filterProjects = (projects, { category, type, industry }) => projects.filter((project) => {
  if (industry && project.industry !== industry) return false;
  const filters = project.filters || {};
  const pool = category === 'All' ? Object.values(filters).flat() : filters[category] || [];
  if (category !== 'All' && pool.length === 0) return false;
  return !type || pool.includes(type);
});
