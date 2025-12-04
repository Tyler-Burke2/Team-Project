// URL Parameters module - handles reading and updating URL parameters

/**
 * Get a specific URL parameter value
 * @param {string} param - The parameter name to retrieve
 * @returns {string|null} The parameter value, or null if not found
 */
export function getUrlParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Get all URL parameters as an object
 * @returns {Object} Object containing all URL parameters
 */
export function getAllUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Update a URL parameter without page reload
 * @param {string} param - The parameter name to update
 * @param {string|number} value - The new value
 */
export function updateUrlParameter(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Remove a URL parameter without page reload
 * @param {string} param - The parameter name to remove
 */
export function removeUrlParameter(param) {
  const url = new URL(window.location);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url);
}

/**
 * Set multiple URL parameters at once
 * @param {Object} params - Object containing parameter key-value pairs
 */
export function setUrlParameters(params) {
  const url = new URL(window.location);
  
  Object.keys(params).forEach(key => {
    url.searchParams.set(key, params[key]);
  });
  
  window.history.pushState({}, '', url);
}

/**
 * Clear all URL parameters
 */
export function clearUrlParameters() {
  const url = new URL(window.location);
  const newUrl = url.origin + url.pathname;
  window.history.pushState({}, '', newUrl);
}

export default {
  getUrlParameter,
  getAllUrlParameters,
  updateUrlParameter,
  removeUrlParameter,
  setUrlParameters,
  clearUrlParameters
};