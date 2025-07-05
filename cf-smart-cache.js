// Combined logic and features from edge-cache-html.js and new-edge-cache-html.js

// API settings if KV isn't being used
const CLOUDFLARE_API = {
  email: "", // From https://dash.cloudflare.com/profile
  key: "", // Global API Key from https://dash.cloudflare.com/profile
  zone: "", // "Zone ID" from the API section of the dashboard overview page https://dash.cloudflare.com/
};

// Default cookie prefixes for bypass
const DEFAULT_BYPASS_COOKIES = [
  "wp-",
  "wordpress",
  "comment_",
  "woocommerce_",
  "PHPSESSID",
  "session",
];

// URL paths to bypass the cache (each pattern is a regex)
const BYPASS_URL_PATTERNS = [/\/wp-admin\/.*/, /\/wp-adminlogin\/.*/];

const CACHE_HEADERS = ["Cache-Control", "Expires", "Pragma"];

/**
 * Main worker entry point.
 */
addEventListener("fetch", (event) => {
  const request = event.request;
  let upstreamCache = request.headers.get("x-HTML-Edge-Cache");

  // Only process requests if KV store is set up and there is no
  // HTML edge cache in front of this worker (only the outermost cache
  // should handle HTML caching in case there are varying levels of support).
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

  // Bypass processing of image requests (for everything except Firefox which doesn't use image/*)
  const accept = request.headers.get("Accept");
  let isImage = false;
  if (accept && accept.indexOf("image/*") !== -1) {
    isImage = true;
  }

  if (configured && !isImage && upstreamCache === null) {
    event.passThroughOnException();
    event.respondWith(processRequest(request, event));
  }
});

/**
 * Process every request coming through to add the edge-cache header,
 * watch for purge responses and possibly cache HTML GET requests.
 *
 * @param {Request} originalRequest - Original request
 * @param {Event} event - Original event (for additional async waiting)
 */
async function processRequest(originalRequest, event) {
  let cfCacheStatus = null;
  const accept = originalRequest.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  let { response, cacheVer, status, bypassCache } = await getCachedResponse(
    originalRequest
  );

  if (response === null) {
    // Clone the request, add the edge-cache header and send it through.
    let request = new Request(originalRequest);
    request.headers.set(
      "x-HTML-Edge-Cache",
      "supports=cache|purgeall|bypass-cookies"
    );
    response = await fetch(request);

    if (response) {
      // Check if we need to bypass the cache for this response
      const bypass = shouldBypassEdgeCache(originalRequest, response);
      if (bypass) {
        response.headers.set("x-HTML-Edge-Cache-Status", "Bypass");
      } else {
        response.headers.set("x-HTML-Edge-Cache-Status", "OK");
      }

      // Only cache HTML GET requests
      if (
        originalRequest.method === "GET" &&
        response.status === 200 &&
        isHTML
      ) {
        // Cache the response (stale-while-revalidate)
        event.waitUntil(
          (async () => {
            // Build the versioned URL for caching
            cacheVer = await GetCurrentCacheVersion(cacheVer);
            const cacheKeyRequest = GenerateCacheRequest(
              originalRequest,
              cacheVer
            );

            // Store the response in the cache
            try {
              if (typeof EDGE_CACHE !== "undefined") {
                await EDGE_CACHE.put(cacheKeyRequest, response.clone());
              }
            } catch (err) {
              console.error("Error writing to cache:", err);
            }
          })()
        );
      }
    }
  } else {
    // If the origin didn't send the control header we will send the cached response but update
    // the cached copy asynchronously (stale-while-revalidate). This commonly happens with
    // a server-side disk cache that serves the HTML directly from disk.
    cfCacheStatus = "HIT";
    if (originalRequest.method === "GET" && response.status === 200 && isHTML) {
      // Nothing additional to do here, cached response is valid
    }
  }

  if (
    response &&
    status !== null &&
    originalRequest.method === "GET" &&
    response.status === 200 &&
    isHTML
  ) {
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", status);
    if (cacheVer !== null) {
      response.headers.set("x-HTML-Edge-Cache-Version", cacheVer);
    }
    if (cfCacheStatus) {
      response.headers.set("x-HTML-Edge-Cache-CF-Status", cfCacheStatus);
    }
  }

  return response;
}

/**
 * Determine if the cache should be bypassed for the given request/response pair.
 * Specifically, if the request includes a cookie that the response flags for bypass.
 * Can be used on cache lookups to determine if the request needs to go to the origin and
 * origin responses to determine if they should be written to cache.
 * @param {Request} request - Request
 * @param {Response} response - Response
 * @returns {bool} true if the cache should be bypassed
 */
function shouldBypassEdgeCache(request, response) {
  let bypassCache = false;

  // Bypass the cache for all requests to a URL that matches any of the URL path bypass patterns
  const url = new URL(request.url);
  const path = url.pathname + url.search;
  if (BYPASS_URL_PATTERNS.length) {
    for (let pattern of BYPASS_URL_PATTERNS) {
      if (pattern.test(path)) {
        bypassCache = true;
        break;
      }
    }
  }

  if (request && response) {
    const options = getResponseOptions(response);
    const cookieHeader = request.headers.get("cookie");
    let bypassCookies = DEFAULT_BYPASS_COOKIES;
    if (options) {
      bypassCookies = options.bypassCookies || bypassCookies;
    }
    if (cookieHeader && cookieHeader.length && bypassCookies.length) {
      for (let cookie of bypassCookies) {
        if (cookieHeader.indexOf(cookie) !== -1) {
          bypassCache = true;
          break;
        }
      }
    }
  }

  return bypassCache;
}

/**
 * Check for cached HTML GET requests.
 *
 * @param {Request} request - Original request
 */
async function getCachedResponse(request) {
  let response = null;
  let cacheVer = null;
  let bypassCache = false;
  let status = "Miss";

  // Only check for HTML GET requests (saves on reading from KV unnecessarily)
  // and not when there are cache-control headers on the request (refresh)
  const accept = request.headers.get("Accept");
  const cacheControl = request.headers.get("Cache-Control");
  let noCache = false;
  if (cacheControl && cacheControl.indexOf("no-cache") !== -1) {
    noCache = true;
    status = "Bypass for Reload";
  }
  if (
    !noCache &&
    request.method === "GET" &&
    accept &&
    accept.indexOf("text/html") >= 0
  ) {
    // Build the versioned URL for checking the cache
    cacheVer = await GetCurrentCacheVersion(cacheVer);
    const cacheKeyRequest = GenerateCacheRequest(request, cacheVer);

    // See if there is a request match in the cache
    try {
      if (typeof EDGE_CACHE !== "undefined") {
        response = await EDGE_CACHE.match(cacheKeyRequest);
        if (response) {
          status = "Hit";
        }
      }
    } catch (err) {
      console.error("Error reading from cache:", err);
    }
  }

  return { response, cacheVer, status, bypassCache };
}

/**
 * Retrieve the current cache version from KV
 * @param {Int} cacheVer - Current cache version value if set.
 * @returns {Int} The current cache version.
 */
async function GetCurrentCacheVersion(cacheVer) {
  if (cacheVer === null) {
    if (typeof EDGE_CACHE !== "undefined") {
      const version = await EDGE_CACHE.get("html_cache_version");
      if (version) {
        cacheVer = parseInt(version, 10);
      }
    }
  }
  return cacheVer;
}

/**
 * Generate the versioned Request object to use for cache operations.
 * @param {Request} request - Base request
 * @param {Int} cacheVer - Current Cache version (must be set)
 * @returns {Request} Versioned request object
 */
function GenerateCacheRequest(request, cacheVer) {
  let cacheUrl = request.url;
  if (cacheUrl.indexOf("?") >= 0) {
    cacheUrl += "&cf_edge_cache_ver=" + cacheVer;
  } else {
    cacheUrl += "?cf_edge_cache_ver=" + cacheVer;
  }
  return new Request(cacheUrl);
}
