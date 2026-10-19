/**
 * Optimize Cloudinary URLs for carousel thumbnails.
 * Requests a 640px wide, auto-quality, auto-format version — 
 * typically 5-10× smaller than the original upload.
 */
export const getOptimizedImage = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_640,q_auto,f_auto/');
};

/**
 * Crisp Cloudinary variants for large cards: a fixed width, high-quality auto
 * compression and no extra downscale, so retina screens get a sharp image.
 */
export const getSharpImage = (url, width = 1200) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto:best,f_auto/`);
};

export const getSharpSrcSet = (url, widths = [800, 1200, 1600]) => {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;
  return widths.map((w) => `${url.replace('/upload/', `/upload/w_${w},q_auto:best,f_auto/`)} ${w}w`).join(', ');
};
