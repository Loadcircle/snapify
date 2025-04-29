/**
 * Generates a random event code of specified length
 * @param {number} length - The length of the code (default: 6)
 * @returns {string} The generated code
 */
export function generateEventCode(length = 6) {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters like 0/O, 1/I
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
} 