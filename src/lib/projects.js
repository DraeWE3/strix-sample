import { useEffect, useMemo, useState } from 'react';
import { neon, run } from './neon';
import { createLiveCollection, pollingListener } from './liveCollection';
import { safeExternalUrl, safeUrl } from './urls';

export { safeExternalUrl };

/**
 * @typedef {Object} ProjectFilters
 * @property {string[]} Design
 * @property {string[]} Development
 * @property {string[]} Production
 * @property {string[]} MVP
 */

/**
 * @typedef {Object} Project
 * @property {string} id Row id (the former Firestore document id)
 * @property {string} title
 * @property {string} categoryText
 * @property {string} industry
 * @property {string} image
 * @property {string} link
 * @property {string} externalLink
 * @property {ProjectFilters} filters
 * @property {'draft' | 'published'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProjectsState
 * @property {Project[]} projects
 * @property {boolean} loading
 * @property {Error | null} error
 */

export const PROJECTS_TABLE = 'projects';

const FILTER_GROUPS = ['Design', 'Development', 'Production', 'MVP'];

const asString = (value) => (typeof value === 'string' ? value : '');

const asStringArray = (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []);

/**
 * @param {string} id
 * @param {Record<string, unknown>} data
 * @returns {Project}
 */
export const mapProject = (id, data = {}) => ({
  id,
  title: asString(data.title),
  categoryText: asString(data.categoryText),
  industry: asString(data.industry),
  image: safeUrl(data.image),
  link: asString(data.link),
  externalLink: asString(data.externalLink),
  filters: Object.fromEntries(FILTER_GROUPS.map((group) => [group, asStringArray(data.filters?.[group])])),
  status: data.status === 'published' ? 'published' : 'draft',
  createdAt: asString(data.createdAt),
  updatedAt: asString(data.updatedAt),
});

/** @param {Project} project */
export const isPublished = (project) => project.status === 'published' && Boolean(project.image);

const CASE_STUDY_LINK = /^\/case-study\/[A-Za-z0-9_-]+$/;

/** @param {Project} project */
export const isExternalProject = (project) => Boolean(safeExternalUrl(project.externalLink));

/** Site path of a project's case study: its `/case-study/<slug>` link, else its document id. */
export const caseStudyPath = (project) => {
  const link = asString(project.link).trim().replace(/\/+$/, '');
  return CASE_STUDY_LINK.test(link) ? link : `/case-study/${encodeURIComponent(project.id)}`;
};

/** @param {Project} project */
export const projectHref = (project) => safeExternalUrl(project.externalLink) || caseStudyPath(project);

/** @param {Project[]} projects */
export const projectsKey = (projects) => projects.map((project) => project.id).join('|');

/**
 * Small seeded PRNG (mulberry32) so a shuffle can be replayed for a given seed.
 * @param {number} seed
 * @returns {() => number}
 */
const createRandom = (seed) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Fisher-Yates shuffle driven by a seed. The same seed and the same ids always
 * yield the same order, so background refreshes don't reorder what's on screen.
 * @template T
 * @param {T[]} items
 * @param {number} seed
 * @returns {T[]}
 */
export const shuffleProjects = (items, seed) => {
  const random = createRandom(seed);
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id);

/**
 * Only published cards are requested (row-level security enforces the same),
 * so drafts never reach visitors. Sorted here, so cards without `createdAt`
 * keep their place at the end.
 * @param {import('@neondatabase/postgrest-js').NeonPostgrestClient} client
 */
export const publishedProjectsQuery = (client) => client.from(PROJECTS_TABLE).select('id, data').eq('status', 'published');

/** @param {Array<{ id: string, data: Record<string, unknown> }>} rows */
export const projectsFromRows = (rows) => rows.map((row) => mapProject(row.id, row.data)).sort(byNewest);

const live = createLiveCollection({
  name: 'projects',
  initial: { projects: [] },
  listen: pollingListener(async () => ({ projects: projectsFromRows(await run(publishedProjectsQuery(neon()))) })),
});

/**
 * Subscribe to the published projects. One shared reader serves every
 * subscriber, so navigating between pages never refetches or flashes a
 * loading state. It refreshes in the background and restarts after errors.
 * @param {(state: ProjectsState) => void} listener
 * @returns {() => void}
 */
export const subscribeToProjects = live.subscribe;

/**
 * Published projects are returned in a random order. A new order is drawn each
 * time a component mounts (every page visit), then held stable for that
 * component's lifetime so re-renders and background refreshes don't reshuffle.
 * Pass `shuffle: false` to keep newest-first order.
 * @param {{ shuffle?: boolean }} [options]
 * @returns {ProjectsState}
 */
export const useProjects = ({ shuffle = true } = {}) => {
  const [snapshot, setSnapshot] = useState(live.getState);
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff));

  useEffect(() => subscribeToProjects(setSnapshot), []);

  const projects = useMemo(() => {
    const list = snapshot.projects.filter(isPublished);
    return shuffle ? shuffleProjects(list, seed) : list;
  }, [snapshot.projects, shuffle, seed]);

  return { projects, loading: snapshot.loading, error: snapshot.error };
};
