import { prisma } from '../db';

// Allowed photo package sizes - must match the values in the API and form
const ALLOWED_PHOTO_PACKAGES = [30, 50, 75, 100, 150, 200];

// Temporary limit for free tier - will be removed when payment gateway is enabled
const MAX_EVENTS_PER_USER = 2;

/**
 * Check if a user has reached their event creation limit
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} True if the user has reached their limit
 */
export async function hasReachedEventLimit(userId) {
  // Count the number of events created by this user
  const count = await prisma.event.count({
    where: { createdById: userId }
  });
  
  // Return true if the user has reached or exceeded the limit
  return count >= MAX_EVENTS_PER_USER;
}

/**
 * Create a new event
 * @param {Object} data - The event data
 * @returns {Promise<Object>} The created event
 */
export async function createEvent(data) {
  // Check if the user has reached their event limit
  if (data.createdById) {
    const hasReachedLimit = await hasReachedEventLimit(data.createdById);
    if (hasReachedLimit) {
      throw new Error(`Has alcanzado el límite de eventos gratuitos.`);
    }
  }

  // Ensure maxPhotos is one of the allowed values
  const maxPhotos = parseInt(data.maxPhotos, 10);
  if (isNaN(maxPhotos) || !ALLOWED_PHOTO_PACKAGES.includes(maxPhotos)) {
    throw new Error(`Valor de maxPhotos inválido. Los valores permitidos son: ${ALLOWED_PHOTO_PACKAGES.join(', ')}`);
  }

  // Create the event with validated data
  return prisma.event.create({
    data: {
      ...data,
      maxPhotos: maxPhotos, // Use the validated value
    },
  });
}

/**
 * Get an event by its ID
 * @param {string} id - The event ID
 * @returns {Promise<Object|null>} The event or null if not found
 */
export async function getEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: { photos: true },
  });
}

/**
 * Get an event by its code
 * @param {string} code - The event code
 * @returns {Promise<Object|null>} The event or null if not found
 */
export async function getEventByCode(code) {
  return prisma.event.findUnique({
    where: { code },
    include: { photos: true },
  });
}

/**
 * Update an event
 * @param {string} id - The event ID
 * @param {Object} data - The data to update
 * @returns {Promise<Object>} The updated event
 */
export async function updateEvent(id, data) {
  // If maxPhotos is being updated, validate it
  if (data.maxPhotos !== undefined) {
    const maxPhotos = parseInt(data.maxPhotos, 10);
    if (isNaN(maxPhotos) || !ALLOWED_PHOTO_PACKAGES.includes(maxPhotos)) {
      throw new Error(`Invalid maxPhotos value. Allowed values are: ${ALLOWED_PHOTO_PACKAGES.join(', ')}`);
    }
    data.maxPhotos = maxPhotos;
  }

  return prisma.event.update({
    where: { id },
    data,
  });
}

/**
 * Delete an event
 * @param {string} id - The event ID
 * @returns {Promise<Object>} The deleted event
 */
export async function deleteEvent(id) {
  return prisma.event.delete({
    where: { id },
  });
}

/**
 * Increment the usedPhotos count for an event
 * @param {string} id - The event ID
 * @returns {Promise<Object>} The updated event
 */
export async function incrementUsedPhotos(id) {
  return prisma.event.update({
    where: { id },
    data: {
      usedPhotos: {
        increment: 1,
      },
    },
  });
} 