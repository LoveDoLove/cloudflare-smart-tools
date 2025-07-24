// =============================
// DEPRECATED FILE (July 2025)
// This file is deprecated. See workers/DEPRECATED.md for details, actionable guidance, and references.
// Do not use for new development. For more information, see InjectMCP Prompt Section 1, 3, 4, and 5.
// References: Cloudflare, 2024; Mozilla, 2024.
// =============================
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
