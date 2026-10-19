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

/** Projects whose filters match the service; an unmapped service matches nothing. */
export const projectsForService = (projects, slug) => {
  const wanted = SERVICE_PROJECT_FILTERS[slug];
  if (!wanted) return [];
  return projects.filter((project) =>
    Object.entries(wanted).some(([group, types]) => types.some((type) => project.filters?.[group]?.includes(type))),
  );
};
