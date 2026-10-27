// Service page slugs, titles and categories, without the page content and artwork in
// serviceDetails.js, so the studio can list services without bundling the service pages.

export const SERVICE_ROUTE_BASE = "/services";
export const serviceRoute = (slug) => `${SERVICE_ROUTE_BASE}/${slug}`;

export const serviceCategories = [
  { id: "design", name: "Design", slugs: ["ui-ux-design", "product-design", "branding", "creative-design", "game-art", "3d-design"] },
  { id: "development", name: "Development", slugs: ["web-app", "app-dev", "interactive-web", "web-dev", "software-dev"] },
  { id: "production", name: "Production", slugs: ["commercials", "long-format", "reels-shorts", "motion-graphics", "3d-animations"] },
];

export const SERVICE_TITLES = {
  "ui-ux-design": "UI/UX Design",
  "product-design": "Product Design",
  branding: "Branding",
  "creative-design": "Creative Designs",
  "game-art": "Game Art",
  "3d-design": "3D Design",
  "web-app": "Web Applications",
  "app-dev": "App Development",
  "interactive-web": "Interactive Websites",
  "web-dev": "Website Development",
  "software-dev": "SaaS AI Development",
  commercials: "Commercials & Promos",
  "long-format": "Long Format Videos",
  "reels-shorts": "Reels & Shorts",
  "motion-graphics": "Motion Graphics",
  "3d-animations": "3D Animations",
};

export const serviceSlugs = serviceCategories.flatMap((category) => category.slugs);

/** Known service slugs from a stored list, deduplicated, in catalog order. */
export const normalizeServiceSlugs = (value) => {
  const chosen = new Set(Array.isArray(value) ? value : []);
  return serviceSlugs.filter((slug) => chosen.has(slug));
};
