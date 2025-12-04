// Local Storage module - handles saving and loading data
const STORAGE_PREFIX = 'zelda_portal_';

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {*} value - The value to store (will be JSON stringified)
 */
export function saveProgress(key, value) {
  try {
    const storageKey = STORAGE_PREFIX + key;
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(storageKey, jsonValue);
    console.log(`Saved ${key} to localStorage`);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {*} The parsed value, or null if not found
 */
export function loadProgress(key) {
  try {
    const storageKey = STORAGE_PREFIX + key;
    const jsonValue = localStorage.getItem(storageKey);
    
    if (jsonValue === null) {
      return null;
    }
    
    const value = JSON.parse(jsonValue);
    console.log(`Loaded ${key} from localStorage`);
    return value;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear specific data from localStorage
 * @param {string} key - The key to remove
 */
export function clearProgress(key) {
  try {
    const storageKey = STORAGE_PREFIX + key;
    localStorage.removeItem(storageKey);
    console.log(`Cleared ${key} from localStorage`);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllProgress() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cleared all app data from localStorage');
  } catch (error) {
    console.error('Error clearing all localStorage:', error);
  }
}

export default { saveProgress, loadProgress, clearProgress, clearAllProgress };