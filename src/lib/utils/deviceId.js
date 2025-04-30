/**
 * Generate a random device ID
 * @returns {string} A unique device ID
 */
function generateDeviceId() {
  return 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Get the device ID from localStorage or generate a new one
 * @returns {string} The device ID
 */
export function getDeviceId() {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return '';
  }
  
  let deviceId = localStorage.getItem('snapify_device_id');
  
  // If no device ID exists, generate one and save it
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('snapify_device_id', deviceId);
  }
  
  return deviceId;
}

/**
 * Save the user name to localStorage
 * @param {string} name - The user name
 */
export function saveUserName(name) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('snapify_user_name', name);
  }
}

/**
 * Get the user name from localStorage
 * @returns {string} The user name or empty string if not found
 */
export function getUserName() {
  if (typeof window === 'undefined') {
    return '';
  }
  
  return localStorage.getItem('snapify_user_name') || '';
} 