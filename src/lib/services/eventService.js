import { prisma } from '../db';

/**
 * Create a new event
 * @param {Object} data - The event data
 * @returns {Promise<Object>} The created event
 */
export async function createEvent(data) {
  return prisma.event.create({
    data,
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