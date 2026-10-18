/**
 * Image uploads to Cloudinary for the content studio.
 *
 * The upload preset is unsigned, so its name ships in the studio bundle. The
 * checks below only stop mistakes in the studio; the real limits must be set
 * on the preset itself in Cloudinary (allowed formats, maximum file size,
 * fixed folder, no overwrite). See README → "Cloudinary".
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const COMPRESS_ABOVE_BYTES = 2 * 1024 * 1024;

/** @param {{ type: string, size: number }} file */
export const uploadProblem = (file) => {
  if (!file) return 'Choose a file to upload.';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Use JPG, PNG, WebP or GIF images.';
  if (file.size > MAX_UPLOAD_BYTES) return 'Each image must be 20 MB or smaller.';
  return '';
};

/**
 * Resizes large images to at most 1920px and re-encodes them as JPEG.
 * Small images and GIFs (which may be animated) are uploaded as they are.
 * @param {File} file
 * @returns {Promise<File>}
 */
const compressImage = (file, quality = 0.8, maxSize = 1920) =>
  new Promise((resolve) => {
    if (file.size < COMPRESS_ABOVE_BYTES || file.type === 'image/gif') {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => resolve(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: Date.now() }) : file),
          'image/jpeg',
          quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Uploads an image to Cloudinary and returns its https URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
export const uploadImage = async (file) => {
  const problem = uploadProblem(file);
  if (problem) throw new Error(problem);
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Image uploads are not configured (VITE_CLOUDINARY_* is missing).');

  const formData = new FormData();
  formData.append('file', await compressImage(file));
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUD_NAME)}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || 'Upload failed.');
  if (typeof data.secure_url !== 'string' || !data.secure_url.startsWith('https://')) throw new Error('The upload did not return an image link.');
  return data.secure_url;
};
