/**
 * Default "The Process" steps per case-study template, matching the Figma
 * designs (nodes 894:4788, 3534:8076, 3534:8137). A case study only stores
 * `process` when an admin has customised it. Pure module: no database imports.
 */
const COPY = {
  discovery: 'We define your core idea, map user journeys, and create wireframes that lock your product vision with direction.',
  design: 'High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks and feels right before development.',
  development: 'We develop the MVP with clean, scalable code & refine through quick sprints to keep results aligned with the vision.',
  launch: 'Before going live, we stress-test every feature for smooth performance, scalability, and future expansion.',
};

const DESIGN_DEVELOPMENT = [
  { title: 'Discovery & Wireframes', description: COPY.discovery },
  { title: 'Design & Validation', description: COPY.design },
  { title: 'Development & Iterations', description: COPY.development },
  { title: 'Test, Launch & Scale', description: COPY.launch },
];

export const PROCESS_DEFAULTS = Object.freeze({
  'design-development': DESIGN_DEVELOPMENT,
  production: [
    { title: 'Discovery & Brief', description: COPY.discovery },
    { title: 'Pre-Production & Creative Direction', description: 'High-fidelity visuals, interactive prototypes, and feedback loops - ensuring every screen looks right.' },
    { title: 'Production & Editing', description: COPY.development },
    { title: 'Delivery & Distribution', description: COPY.launch },
  ],
  mvp: DESIGN_DEVELOPMENT,
});

export const PROCESS_MAX_STEPS = 6;

/** Steps a case study can show: its own valid steps, else the template default. */
export const resolveProcess = (stored, template) => {
  const own = (Array.isArray(stored) ? stored : [])
    .filter((step) => step && typeof step.title === 'string' && step.title.trim())
    .slice(0, PROCESS_MAX_STEPS)
    .map((step) => ({ title: step.title.trim(), description: typeof step.description === 'string' ? step.description.trim() : '' }));
  return own.length ? own : PROCESS_DEFAULTS[template] || [];
};
