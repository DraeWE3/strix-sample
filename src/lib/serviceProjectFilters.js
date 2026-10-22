import { SERVICE_ROUTE_BASE, getServiceCategory, serviceDetails, serviceRoute, serviceSlugs } from "../data/serviceDetails";

// Project filter types (see components/projects/projectFilters.js) that count as
// "related" for each service detail page.
export const SERVICE_PROJECT_FILTERS = {
  "ui-ux-design": { Design: ["UI/UX", "Web Design", "App Design"] },
  "product-design": { Design: ["UI/UX", "App Design"] },
  branding: { Design: ["Branding", "Graphics"] },
  "creative-design": { Design: ["Graphics", "Branding"] },
  "game-art": { Production: ["3D"] },
  "3d-design": { Production: ["3D"] },
  "web-app": { Development: ["Web-app"] },
  "app-dev": { Development: ["Application"] },
  "interactive-web": { Development: ["Website", "Landing page"] },
  "web-dev": { Development: ["Website", "Landing page", "E-commerce"] },
  "software-dev": { Development: ["Web-app", "Application"] },
  commercials: { Production: ["Promos"] },
  "long-format": { Production: ["Long Format"] },
  "reels-shorts": { Production: ["Reels/shorts"] },
  "motion-graphics": { Production: ["Motion Graphics"] },
  "3d-animations": { Production: ["3D"] },
};

const matchesService = (filters, slug) => {
  const wanted = SERVICE_PROJECT_FILTERS[slug];
  return Boolean(wanted) &&
    Object.entries(wanted).some(([group, types]) => types.some((type) => filters?.[group]?.includes(type)));
};

/** Projects whose filters match the service; an unmapped service matches nothing. */
export const projectsForService = (projects, slug) => projects.filter((project) => matchesService(project.filters, slug));

const normalizeLabel = (text) => text.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();

// Free-text service names editors type into case studies, beyond each page's own title.
const SERVICE_ALIASES = {
  "ui ux": "ui-ux-design",
  "ui and ux": "ui-ux-design",
  "ui and ux design": "ui-ux-design",
  "web design": "ui-ux-design",
  "website design": "ui-ux-design",
  "app design": "ui-ux-design",
  "mobile app design": "ui-ux-design",
  "saas product design": "product-design",
  "brand identity": "branding",
  "brand design": "branding",
  "logo design": "branding",
  graphics: "creative-design",
  "graphic design": "creative-design",
  "creative design": "creative-design",
  "pitch deck": "creative-design",
  "game design": "game-art",
  "3d": "3d-design",
  "3d modelling": "3d-design",
  "3d modeling": "3d-design",
  "web app": "web-app",
  "web application": "web-app",
  "app": "app-dev",
  application: "app-dev",
  "mobile app development": "app-dev",
  "mobile development": "app-dev",
  "interactive website": "interactive-web",
  "landing page": "interactive-web",
  website: "web-dev",
  "web development": "web-dev",
  "e commerce": "web-dev",
  ecommerce: "web-dev",
  "software development": "software-dev",
  saas: "software-dev",
  "saas development": "software-dev",
  "ai development": "software-dev",
  commercial: "commercials",
  promo: "commercials",
  promos: "commercials",
  "long format": "long-format",
  "long form": "long-format",
  "long form video": "long-format",
  reels: "reels-shorts",
  shorts: "reels-shorts",
  "reels and shorts": "reels-shorts",
  "reels shorts": "reels-shorts",
  "3d animation": "3d-animations",
};

const SERVICE_BY_LABEL = new Map([
  ...serviceSlugs.map((slug) => [normalizeLabel(serviceDetails[slug].title), slug]),
  ...Object.entries(SERVICE_ALIASES),
]);

// Broad tags (the template defaults "Production" / "Minimum Viable Product") name a group, not a service;
// null searches every service.
const GROUP_TAGS = { design: "design", development: "development", production: "production", mvp: null, "minimum viable product": null };

/**
 * Service page for a case-study tag. A broad tag resolves to the first service in its group the
 * project's filters match; anything unresolved falls back to the services overview.
 */
export const serviceHrefForTag = (label, filters) => {
  const key = normalizeLabel(label);
  const slug = SERVICE_BY_LABEL.get(key) ?? SERVICE_BY_LABEL.get(key.replace(/s$/, ""));
  if (slug) return serviceRoute(slug);
  if (Object.hasOwn(GROUP_TAGS, key)) {
    const group = GROUP_TAGS[key];
    const match = (group ? getServiceCategory(group).slugs : serviceSlugs).find((candidate) => matchesService(filters, candidate));
    if (match) return serviceRoute(match);
  }
  return SERVICE_ROUTE_BASE;
};
