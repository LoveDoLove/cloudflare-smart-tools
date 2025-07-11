// cf-smart-cache-html-v2.js
// KV-based HTML edge caching for Cloudflare Workers

// IMPORTANT: Either a Key/Value Namespace must be bound to this worker script
// using the variable name EDGE_CACHE, or the API parameters below should be configured.
// KV is recommended if possible since it can purge just the HTML instead of the full cache.

const CLOUDFLARE_API = {
  email: "", // From https://dash.cloudflare.com/profile
  key: "", // Global API Key from https://dash.cloudflare.com/profile
  zone: "", // "Zone ID" from the API section of the dashboard overview page https://dash.cloudflare.com/
};

const CACHE_HEADERS = ["Cache-Control", "Expires", "Pragma"];

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  // Only cache GET HTML requests
  const accept = request.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  if (request.method !== "GET" || !isHTML) {
    return fetch(request);
  }

  // Use versioned cache key
  const cacheVer = await getCurrentCacheVersion();
  const cacheKeyRequest = generateCacheRequest(request, cacheVer);
  let cache = caches.default;
  let cachedResponse = await cache.match(cacheKeyRequest);
  if (cachedResponse) {
    // Clean up headers for the response
    cachedResponse = new Response(cachedResponse.body, cachedResponse);
    cachedResponse.headers.set("x-HTML-Edge-Cache-Status", "Hit");
    return cachedResponse;
  }

  // Forward request to origin
  let forwardRequest = new Request(request);
  forwardRequest.headers.set(
    "x-HTML-Edge-Cache",
    "supports=cache|purgeall|bypass-cookies"
  );
  let response = await fetch(forwardRequest);

  // Purge logic: if origin signals purge, bump version
  const edgeCacheHeader = response.headers.get("x-HTML-Edge-Cache");
  if (edgeCacheHeader && edgeCacheHeader.includes("purgeall")) {
    await purgeCache();
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", "Purged");
    return response;
  }

  // Bypass caching if request has cookies (possible private session)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader && cookieHeader.length) {
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", "Bypass Any Cookie");
    return response;
  }

  // Bypass if response has Set-Cookie header (dynamic content)
  if (response.headers.has("Set-Cookie")) {
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", "Bypass Set-Cookie");
    return response;
  }

  // Bypass if response is not 200 or not HTML
  if (response.status !== 200 || !isHTML) {
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", `Bypass Status/Type: ${response.status}`);
    return response;
  }

  // Bypass if response has Cache-Control: private or no-store
  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl && (/private|no-store|no-cache/i).test(cacheControl)) {
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", "Bypass Cache-Control: " + cacheControl);
    return response;
  }

  // Cache the response (public, safe, static HTML)
  let safeResponse = new Response(response.body, response);
  safeResponse.headers.delete("Set-Cookie");
  safeResponse.headers.set("Cache-Control", "public; max-age=315360000");
  safeResponse.headers.set("x-HTML-Edge-Cache-Status", "Cached");
  event.waitUntil(cache.put(cacheKeyRequest, safeResponse.clone()));
  return safeResponse;
}

// KV version helpers
async function getCurrentCacheVersion() {
  if (typeof EDGE_CACHE !== "undefined") {
    let cacheVer = await EDGE_CACHE.get("html_cache_version");
    if (cacheVer === null) {
      cacheVer = 0;
      await EDGE_CACHE.put("html_cache_version", cacheVer.toString());
    } else {
      cacheVer = parseInt(cacheVer);
    }
    return cacheVer;
  } else {
    return 0;
  }
}

function generateCacheRequest(request, cacheVer) {
  let cacheUrl = request.url;
  if (cacheUrl.indexOf("?") >= 0) {
    cacheUrl += "&";
  } else {
    cacheUrl += "?";
  }
  cacheUrl += "cf_edge_cache_ver=" + cacheVer;
  return new Request(cacheUrl);
}

async function purgeCache() {
  if (typeof EDGE_CACHE !== "undefined") {
    let cacheVer = await getCurrentCacheVersion();
    cacheVer++;
    await EDGE_CACHE.put("html_cache_version", cacheVer.toString());
  }
}
