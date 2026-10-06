import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../admin/firebaseconfig';

/**
 * @typedef {Object} ProjectFilters
 * @property {string[]} Design
 * @property {string[]} Development
 * @property {string[]} Production
 */

/**
 * @typedef {Object} Project
 * @property {string} id Firestore document id
 * @property {string} title
 * @property {string} categoryText
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

export const PROJECTS_COLLECTION = 'projects';

const FILTER_GROUPS = ['Design', 'Development', 'Production'];

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
  image: asString(data.image),
  link: asString(data.link),
  externalLink: asString(data.externalLink),
  filters: Object.fromEntries(FILTER_GROUPS.map((group) => [group, asStringArray(data.filters?.[group])])),
  status: data.status === 'published' ? 'published' : 'draft',
  createdAt: asString(data.createdAt),
  updatedAt: asString(data.updatedAt),
});

/** @param {Project} project */
export const isPublished = (project) => project.status === 'published' && Boolean(project.image);

/** @param {Project} project */
export const isExternalProject = (project) => /^https?:\/\//.test(project.externalLink);

/** @param {Project} project */
export const projectHref = (project) =>
  (isExternalProject(project) ? project.externalLink : project.link) || `/case-study/${project.id}`;

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
 * yield the same order, so live Firestore updates don't reorder what's on screen.
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

/** @type {ProjectsState} */
let state = { projects: [], loading: true, error: null };
const listeners = new Set();
let unsubscribe = null;

const emit = (next) => {
  state = next;
  listeners.forEach((listener) => listener(state));
};

const start = () => {
  if (unsubscribe) return;
  unsubscribe = onSnapshot(
    query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc')),
    (snapshot) => emit({ projects: snapshot.docs.map((doc) => mapProject(doc.id, doc.data())), loading: false, error: null }),
    (error) => emit({ ...state, loading: false, error })
  );
};

/**
 * Subscribe to the live Firestore projects collection. A single real-time
 * listener is shared by every subscriber for the lifetime of the app, so
 * navigating between pages never refetches or flashes a loading state.
 * @param {(state: ProjectsState) => void} listener
 * @returns {() => void}
 */
export const subscribeToProjects = (listener) => {
  listeners.add(listener);
  start();
  listener(state);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Published projects are returned in a random order. A new order is drawn each
 * time a component mounts (every page visit), then held stable for that
 * component's lifetime so re-renders and snapshot updates don't reshuffle.
 * Pass `shuffle: false` (used by the admin) to keep newest-first order.
 * @param {{ includeDrafts?: boolean, shuffle?: boolean }} [options]
 * @returns {ProjectsState}
 */
export const useProjects = ({ includeDrafts = false, shuffle = !includeDrafts } = {}) => {
  const [snapshot, setSnapshot] = useState(state);
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff));

  useEffect(() => subscribeToProjects(setSnapshot), []);

  const projects = useMemo(() => {
    const list = includeDrafts ? snapshot.projects : snapshot.projects.filter(isPublished);
    return shuffle ? shuffleProjects(list, seed) : list;
  }, [snapshot.projects, includeDrafts, shuffle, seed]);

  return { projects, loading: snapshot.loading, error: snapshot.error };
};
