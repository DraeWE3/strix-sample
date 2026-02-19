
/**
 * Cloudinary Storage Utility
 * 
 * To use this:
 * 1. Create a free account at https://cloudinary.com
 * 2. Go to Settings > Upload > Upload presets
 * 3. Click "Add upload preset"
 * 4. Name it "strix_unsigned" (or change the constant below)
 * 5. Set "Signing Mode" to "Unsigned"
 * 6. Save and copy your "Cloud Name" from the Dashboard
 */

// TODO: REPLACE THESE WTH YOUR ACTUAL CLOUDINARY DETAILS
const CLOUD_NAME = "dga60ut51";
const UPLOAD_PRESET = "strix-unsigned";

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * @param {File} file - The file object from the input.
 * @returns {Promise<string>} - The HTTPS URL of the uploaded image.
 */
export const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
