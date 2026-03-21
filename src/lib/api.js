// src/lib/api.js

/**
 * Standardize API fetch responses and error handling.
 */
async function fetchWithConfig(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${url}:`, error.message);
    throw error;
  }
}

/**
 * Fetch services with optional filters.
 * @param {Object} filters
 * @returns {Promise<Array>} List of services
 */
export async function fetchServices(filters = {}) {
  // Convert filters object into query string safely
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });

  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  return fetchWithConfig(`/api/services${queryString}`, { method: 'GET' });
}

/**
 * Book a service.
 * @param {Object} data Booking payload
 * @returns {Promise<Object>} Booking confirmation
 */
export async function bookService(data) {
  return fetchWithConfig('/api/book', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
