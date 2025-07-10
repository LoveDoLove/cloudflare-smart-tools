// cf-smart-cache-html-v2.js
// Core logic for forwarding and processing the response, refactored from v1.
// This version focuses on the main response handling and cache logic, modularized for clarity.

// IMPORTANT: Either A Key/Value Namespace must be bound to this worker script
// using the variable name EDGE_CACHE. or the API parameters below should be
// configured. KV is recommended if possible since it can purge just the HTML
// instead of the full cache.

const CLOUDFLARE_API = {
  email: "", // From https://dash.cloudflare.com/profile
  key: "", // Global API Key from https://dash.cloudflare.com/profile
  zone: "", // "Zone ID" from the API section of the dashboard overview page https://dash.cloudflare.com/
};

const DEFAULT_BYPASS_COOKIES = [
  "wp-",
  "wordpress",
  "comment_",
  "woocommerce_",
  "PHPSESSID",
  "session",
];

const BYPASS_URL_PATTERNS = [/\/wp-admin\/.*/, /\/wp-adminlogin\/.*/];

const CACHE_HEADERS = ["Cache-Control", "Expires", "Pragma"];

addEventListener("fetch", (event) => {
  const request = event.request;
  let upstreamCache = request.headers.get("x-HTML-Edge-Cache");
  let configured = false;
  if (typeof EDGE_CACHE !== "undefined") {
    configured = true;
  } else if (
    CLOUDFLARE_API.email.length &&
    CLOUDFLARE_API.key.length &&
    CLOUDFLARE_API.zone.length
  ) {
    configured = true;
  }
  const accept = request.headers.get("Accept");
  let isImage = false;
  if (accept && accept.indexOf("image/*") !== -1) {
    isImage = true;
  }
  if (configured && !isImage && upstreamCache === null) {
    event.passThroughOnException();
    event.respondWith(forwardAndProcessResponse(request, event));
  }
});

/**
 * Core function: Forwards the request, processes the response, and handles cache logic.
 * Modularized for clarity and reuse.
 * @param {Request} request
 * @param {Event} event
 * @returns {Promise<Response>}
 */
async function forwardAndProcessResponse(request, event) {
  // Add the edge-cache header and forward the request
  let forwardRequest = new Request(request);
  forwardRequest.headers.set(
    "x-HTML-Edge-Cache",
    "supports=cache|purgeall|bypass-cookies"
  );
  let response = await fetch(forwardRequest);
  // Process response for cache, purge, and bypass logic
  response = await processForwardedResponse(request, response, event);
  return response;
}

/**
 * Processes the forwarded response: handles purge, cache, and bypass logic.
 * @param {Request} originalRequest
 * @param {Response} response
 * @param {Event} event
 * @returns {Promise<Response>}
 */
async function processForwardedResponse(originalRequest, response, event) {
  // Placeholder for future modularization: cache, purge, bypass, etc.
  // For now, just return the response as-is.
  return response;
}

// Additional modular functions (cache, purge, bypass, etc.) will be implemented in subsequent steps.
