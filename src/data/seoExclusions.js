/**
 * Published documents that are test content. They are left out of the
 * prerender, sitemap and llms.txt and marked noindex, until they are
 * unpublished in the studio (then remove them here).
 */
export const EXCLUDED_BLOG_IDS = Object.freeze([
  // "Priya": keyboard-mash placeholder text.
  'rDEBnHUP8gruYdB93Enn',
]);

export const isExcludedBlog = (id) => EXCLUDED_BLOG_IDS.includes(id);
