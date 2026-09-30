/**
 * Optimize Cloudinary URLs for carousel thumbnails.
 * Requests a 640px wide, auto-quality, auto-format version — 
 * typically 5-10× smaller than the original upload.
 */
export const getOptimizedImage = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_640,q_auto,f_auto/');
};
