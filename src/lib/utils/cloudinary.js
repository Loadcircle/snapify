import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {string} base64Image - The base64 encoded image data
 * @param {string} eventCode - The event code to use as a folder name
 * @returns {Promise<Object>} The upload result with URL
 */
export async function uploadImage(base64Image, eventCode) {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `snapify/events/${eventCode}`,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' }, // Resize large images to max width 1200px
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>} The deletion result
 */
export async function deleteImage(publicId) {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image. Please try again.');
  }
} 