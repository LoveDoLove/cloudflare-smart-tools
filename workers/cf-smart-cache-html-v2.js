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
  // --- Improved Smart Caching Logic ---
  // Only cache safe, non-dynamic HTML responses. Avoid caching if:
  // - The request has cookies that indicate a logged-in or dynamic session
  // - The response has Set-Cookie headers (dynamic content)
  // - The response is not a 200 OK or not HTML
  // - The request URL matches a bypass pattern
  // - The response has headers that indicate it should not be cached

  const accept = originalRequest.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  const method = originalRequest.method;
  let status = "Miss";
  let cacheVer = null;
  let bypassCache = false;

  // 1. Bypass if URL matches bypass patterns
  const url = new URL(originalRequest.url);
  const path = url.pathname + url.search;
  for (let pattern of BYPASS_URL_PATTERNS) {
    if (pattern.test(path)) {
      bypassCache = true;
      status = "Bypass URL Pattern";
      break;
    }
  }

  // 2. Bypass if request has cookies that match bypass cookies
  if (!bypassCache) {
    const cookieHeader = originalRequest.headers.get("cookie");
    if (cookieHeader && cookieHeader.length) {
      const cookies = cookieHeader.split(";");
      for (let cookie of cookies) {
        for (let prefix of DEFAULT_BYPASS_COOKIES) {
          if (cookie.trim().startsWith(prefix) || cookie.trim().includes(prefix)) {
            bypassCache = true;
            status = "Bypass Cookie: " + prefix;
            break;
          }
        }
        if (bypassCache) break;
      }
    }
  }

  // 3. Bypass if response has Set-Cookie header (dynamic content)
  if (!bypassCache && response.headers.has("Set-Cookie")) {
    bypassCache = true;
    status = "Bypass Set-Cookie";
  }

  // 4. Bypass if response is not 200 or not HTML
  if (!bypassCache && (!isHTML || response.status !== 200)) {
    bypassCache = true;
    status = `Bypass Status/Type: ${response.status}`;
  }

  // 5. Bypass if response has Cache-Control: private or no-store
  if (!bypassCache) {
    const cacheControl = response.headers.get("Cache-Control");
    if (cacheControl && (/private|no-store|no-cache/i).test(cacheControl)) {
      bypassCache = true;
      status = "Bypass Cache-Control: " + cacheControl;
    }
  }

  // 6. If not bypassed, cache the response (public, safe, static HTML)
  if (!bypassCache && method === "GET") {
    // Remove Set-Cookie header for cache safety
    let safeResponse = new Response(response.body, response);
    safeResponse.headers.delete("Set-Cookie");
    safeResponse.headers.set("Cache-Control", "public; max-age=315360000");
    // Optionally, add a custom header for cache status
    safeResponse.headers.set("x-HTML-Edge-Cache-Status", "Hit");
    // Store in cache (if using KV, implement versioning as in v1)
    // For now, use the default cache
    try {
      cacheVer = 0; // For future: implement versioning
      const cacheKeyRequest = new Request(originalRequest.url + `?cf_edge_cache_ver=${cacheVer}`);
      event.waitUntil(caches.default.put(cacheKeyRequest, safeResponse.clone()));
      return safeResponse;
    } catch (err) {
      // If cache fails, just return the response
      safeResponse.headers.set("x-HTML-Edge-Cache-Status", "Cache Write Exception");
      return safeResponse;
    }
  }

  // If bypassed, add a header to indicate why
  let bypassedResponse = new Response(response.body, response);
  bypassedResponse.headers.set("x-HTML-Edge-Cache-Status", status);
  return bypassedResponse;
}

// Additional modular functions (cache, purge, bypass, etc.) will be implemented in subsequent steps.
