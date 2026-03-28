import { api } from "../app/lib/api.js";

/**
 * apiRequest facade to support legacy/different call signatures.
 * @param {string} path 
 * @param {string} method 
 * @param {object} body 
 */
export async function apiRequest(path, method = "GET", body = null) {
  // Use the internal api function from src/app/lib/api.js via its default export? 
  // Wait, src/app/lib/api.js doesn't have a default export. It exports 'api' but as a non-exported local.
  // I should check if I can just import 'api' if I export it from src/app/lib/api.js.
  
  // Let's modify src/app/lib/api.js to export 'api' first.
  return api(path, { method, body });
}
