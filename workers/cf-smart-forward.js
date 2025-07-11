// cf-smart-forward-v1.js
// Minimal Cloudflare Worker: just forwards the request to the origin and returns the response.
// No caching, no KV, no edge logic—pure pass-through for debugging and development.

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Forwards the request to the origin and returns the response as-is.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  // Forward the request to the origin and return the response
  return fetch(request);
}
