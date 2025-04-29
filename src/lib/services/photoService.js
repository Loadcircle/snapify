import { prisma } from '../db';
import { incrementUsedPhotos } from './eventService';
import { deleteImage } from '../utils/cloudinary';

/**
 * Create a new photo
 * @param {Object} data - The photo data including Cloudinary fields
 * @returns {Promise<Object>} The created photo
 */
export async function createPhoto(data) {
  // Start a transaction to ensure both operations succeed or fail together
  return prisma.$transaction(async (tx) => {
    // Create the photo
    const photo = await tx.photo.create({
      data,
    });
    
    // Increment the usedPhotos count on the event
    await tx.event.update({
      where: { id: data.eventId },
      data: {
        usedPhotos: {
          increment: 1,
        },
      },
    });
    
    return photo;
  });
}

/**
 * Get a photo by its ID
 * @param {string} id - The photo ID
 * @returns {Promise<Object|null>} The photo or null if not found
 */
export async function getPhotoById(id) {
  return prisma.photo.findUnique({
    where: { id },
    include: { event: true },
  });
}

/**
 * Get all photos for an event
 * @param {string} eventId - The event ID
 * @returns {Promise<Array>} The photos
 */
export async function getPhotosByEventId(eventId) {
  return prisma.photo.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Delete a photo
 * @param {string} id - The photo ID
 * @returns {Promise<Object>} The deleted photo
 */
export async function deletePhoto(id) {
  // Get the photo first to get the Cloudinary publicId
  const photo = await prisma.photo.findUnique({
    where: { id },
  });
  
  if (!photo) {
    throw new Error('Photo not found');
  }
  
  // Delete from Cloudinary if publicId exists
  if (photo.publicId) {
    await deleteImage(photo.publicId);
  }
  
  // Delete from database
  return prisma.photo.delete({
    where: { id },
  });
} 