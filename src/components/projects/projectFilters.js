export const PAGE_SIZE = 6;

export const FILTERS = {
  Design: ['UI/UX', 'Graphics', 'Branding', 'App Design', 'Web Design'],
  Development: ['Website', 'Web-app', 'Application', 'E-commerce', 'Landing page'],
  Production: ['3D', 'Promos', 'Long Format', 'Reels/shorts', 'Motion Graphics'],
};

export const CATEGORIES = ['All', ...Object.keys(FILTERS)];

const typesFor = (category) => (FILTERS[category] ? FILTERS[category] : Object.values(FILTERS).flat());

export const normalizeState = ({ category, type, shown } = {}) => {
  const validCategory = CATEGORIES.includes(category) ? category : 'All';
  const validType = typesFor(validCategory).includes(type) ? type : '';
  const requested = Number(shown);
  const limit = Number.isFinite(requested) && requested > PAGE_SIZE
    ? Math.floor(requested / PAGE_SIZE) * PAGE_SIZE
    : PAGE_SIZE;
  return { category: validCategory, type: validType, limit };
};

export const stateFromSearch = (params) => normalizeState({
  category: params.get('category'),
  type: params.get('type'),
  shown: params.get('shown'),
});

export const searchFromState = ({ category, type, limit }) => {
  const params = {};
  if (category !== 'All') params.category = category;
  if (type) params.type = type;
  if (limit > PAGE_SIZE) params.shown = String(limit);
  return params;
};

export const filterProjects = (projects, { category, type }) => projects.filter((project) => {
  const filters = project.filters || {};
  const pool = category === 'All' ? Object.values(filters).flat() : filters[category] || [];
  if (category !== 'All' && pool.length === 0) return false;
  return !type || pool.includes(type);
});
