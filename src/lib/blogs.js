import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../admin/firebaseconfig';

/**
 * @typedef {Object} BlogBlock
 * @property {string} key
 * @property {'paragraph' | 'subheading' | 'image' | 'keypoints'} type
 * @property {string | string[]} content
 */

/**
 * @typedef {Object} BlogAuthor
 * @property {string} name
 * @property {string} role
 * @property {string} bio
 * @property {string} avatar
 * @property {string} linkedin
 * @property {string} email
 */

/**
 * @typedef {Object} Blog
 * @property {string} id Firestore document id, also the public URL segment
 * @property {string} title Article page heading (`headerText`, falls back to `topic`)
 * @property {string} cardTitle Listing card title (`topic`, falls back to `headerText`)
 * @property {string} category `tag`
 * @property {string} date YYYY-MM-DD
 * @property {string} image Card image
 * @property {string} coverImage Article header image (`detailsImage`, falls back to `image`)
 * @property {string} excerpt
 * @property {number} readTime Minutes
 * @property {BlogBlock[]} content
 * @property {BlogAuthor | null} author
 * @property {'draft' | 'published'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} BlogsState
 * @property {Blog[]} blogs
 * @property {boolean} loading
 * @property {Error | null} error
 */

export const BLOGS_COLLECTION = 'blogs';

const BLOCK_TYPES = ['paragraph', 'subheading', 'image', 'keypoints'];
const WORDS_PER_MINUTE = 200;
const EXCERPT_LENGTH = 180;

const asString = (value) => (typeof value === 'string' ? value.trim() : '');

const mapBlock = (block, index) => {
  if (!block || !BLOCK_TYPES.includes(block.type)) return null;
  const key = `${block.id ?? 'block'}-${index}`;
  if (block.type === 'keypoints') {
    const points = Array.isArray(block.content) ? block.content.map(asString).filter(Boolean) : [];
    return points.length ? { key, type: block.type, content: points } : null;
  }
  const content = asString(block.content);
  return content ? { key, type: block.type, content } : null;
};

const blockText = (block) => (Array.isArray(block.content) ? block.content.join(' ') : block.type === 'image' ? '' : block.content);

const truncate = (text, length) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, clean.lastIndexOf(' ', length) > 0 ? clean.lastIndexOf(' ', length) : length)}…`;
};

const mapAuthor = (author) => {
  if (!author || typeof author !== 'object' || !asString(author.name)) return null;
  return {
    name: asString(author.name),
    role: asString(author.role),
    bio: asString(author.bio),
    avatar: asString(author.avatar),
    linkedin: asString(author.linkedin),
    email: asString(author.email),
  };
};

/**
 * @param {string} id
 * @param {Record<string, unknown>} data
 * @returns {Blog}
 */
export const mapBlog = (id, data = {}) => {
  const content = (Array.isArray(data.content) ? data.content : []).map(mapBlock).filter(Boolean);
  const words = content.map(blockText).join(' ').split(/\s+/).filter(Boolean).length;
  const firstParagraph = content.find((block) => block.type === 'paragraph');
  const title = asString(data.headerText) || asString(data.topic);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(asString(data.date)) ? asString(data.date) : asString(data.createdAt).slice(0, 10);
  return {
    id,
    title,
    cardTitle: asString(data.topic) || title,
    category: asString(data.tag),
    date,
    image: asString(data.image),
    coverImage: asString(data.detailsImage) || asString(data.image),
    excerpt: asString(data.excerpt) || (firstParagraph ? truncate(firstParagraph.content, EXCERPT_LENGTH) : ''),
    readTime: Number.isFinite(data.readTime) && data.readTime > 0 ? Math.round(data.readTime) : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
    content,
    author: mapAuthor(data.author),
    status: data.status === 'published' ? 'published' : 'draft',
    createdAt: asString(data.createdAt),
    updatedAt: asString(data.updatedAt),
  };
};

/** @param {Blog} blog */
export const blogHref = (blog) => `/blog/${encodeURIComponent(blog.id)}`;

export const BLOG_SITE_URL = 'https://www.strixproduction.com';

/** @param {string} value YYYY-MM-DD */
export const formatBlogDate = (value, style = 'card') => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return '';
  const [, year, month, day] = match.map(Number);
  return style === 'article' ? `${day}.${month}.${year}` : `${month}/${day}/${year}`;
};

const byNewest = (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);

/** @type {BlogsState} */
let state = { blogs: [], loading: true, error: null };
const listeners = new Set();
let unsubscribe = null;

const emit = (next) => {
  state = next;
  listeners.forEach((listener) => listener(state));
};

const start = () => {
  if (unsubscribe) return;
  unsubscribe = onSnapshot(
    query(collection(db, BLOGS_COLLECTION), where('status', '==', 'published')),
    (snapshot) => {
      const blogs = snapshot.docs
        .map((doc) => mapBlog(doc.id, doc.data()))
        .filter((blog) => blog.title)
        .sort(byNewest);
      emit({ blogs, loading: false, error: null });
    },
    (error) => {
      console.error('Error loading blogs:', error);
      emit({ ...state, loading: false, error });
    }
  );
};

/**
 * Subscribe to the published posts in the Firestore `blogs` collection. One
 * real-time listener is shared by the listing and article pages.
 * @param {(state: BlogsState) => void} listener
 * @returns {() => void}
 */
export const subscribeToBlogs = (listener) => {
  listeners.add(listener);
  start();
  listener(state);
  return () => {
    listeners.delete(listener);
  };
};

/** @returns {BlogsState} */
export const useBlogs = () => {
  const [snapshot, setSnapshot] = useState(state);
  useEffect(() => subscribeToBlogs(setSnapshot), []);
  return snapshot;
};

/**
 * Categories in the order the Figma sidebar lists them: Tips and News first,
 * then the remaining tags in order of first appearance.
 * @param {Blog[]} blogs
 */
export const useBlogCategories = (blogs) =>
  useMemo(() => {
    const tags = [...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
    const pinned = ['Tips', 'News'].filter((tag) => tags.includes(tag));
    return { pinned, rest: tags.filter((tag) => !pinned.includes(tag)) };
  }, [blogs]);

/**
 * Up to `count` other posts, same category first, then newest.
 * @param {Blog[]} blogs
 * @param {Blog} current
 */
export const relatedBlogs = (blogs, current, count = 3) => {
  const others = blogs.filter((blog) => blog.id !== current.id);
  return [
    ...others.filter((blog) => blog.category === current.category),
    ...others.filter((blog) => blog.category !== current.category),
  ].slice(0, count);
};

/** @param {Blog} blog */
export const blogSearchText = (blog) =>
  [blog.cardTitle, blog.title, blog.excerpt, blog.category, ...blog.content.map(blockText)].join(' ').toLowerCase();

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'section';

/**
 * Subheading blocks become the table of contents. Ids are unique per article.
 * @param {BlogBlock[]} blocks
 */
export const blogHeadings = (blocks) => {
  const used = new Set();
  return blocks
    .filter((block) => block.type === 'subheading')
    .map((block) => {
      const base = slugify(block.content);
      let id = base;
      for (let i = 2; used.has(id); i += 1) id = `${base}-${i}`;
      used.add(id);
      return { key: block.key, id, text: block.content };
    });
};
