// List of cookie prefixes that indicate a logged-in or session user (WordPress, WooCommerce, PHPSESSID, etc.)
const LOGIN_COOKIE_PREFIXES = [
  "wordpress_logged_in",
  "wp-",
  "wordpress_sec",
  "woocommerce_",
  "PHPSESSID",
  "session",
  "auth",
  "token",
  "user",
  "wordpress",
  "comment_",
  "wp_postpass",
  "edd_",
  "memberpress_",
  "wpsc_",
  "wc_",
  "jevents_",
  // Add your own hosting's login/session cookie names or prefixes here
];

// cf-smart-cache-html-v2.js
// KV-based HTML edge caching for Cloudflare Workers with Stale-While-Revalidate


// Stale-While-Revalidate window (in seconds)
const SWR_WINDOW = 30; // Serve stale cache for up to 30 seconds while revalidating

// Config: If false, do NOT serve stale content while updating (matches Cloudflare dashboard option)
const SERVE_STALE_WHILE_REVALIDATE = true; // Set to false to disable SWR and always wait for fresh

// IMPORTANT: Either a Key/Value Namespace must be bound to this worker script
// using the variable name SMART_CACHE, or the API parameters below should be configured.
// KV is recommended if possible since it can purge just the HTML instead of the full cache.

const CLOUDFLARE_API = {
  email: "", // From https://dash.cloudflare.com/profile
  key: "", // Global API Key from https://dash.cloudflare.com/profile
  zone: "", // "Zone ID" from the API section of the dashboard overview page https://dash.cloudflare.com/
};

const CACHE_HEADERS = ["Cache-Control", "Expires", "Pragma"];

addEventListener("fetch", (event) => {
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
  let swrMetaKey = cacheKeyRequest.url + "::swr_meta";
  let swrMeta = undefined;
  if (cachedResponse) {
    // Try to get SWR metadata from KV (timestamp of last update)
    if (typeof SMART_CACHE !== "undefined") {
      swrMeta = await SMART_CACHE.get(swrMetaKey);
    }
    let now = Math.floor(Date.now() / 1000);
    let lastUpdate = swrMeta ? parseInt(swrMeta) : now;
    let age = now - lastUpdate;
    if (age <= 0 || age < 315360000) {
      // If not stale (max-age=315360000), serve as fresh
      cachedResponse = new Response(cachedResponse.body, cachedResponse);
      cachedResponse.headers.set("x-HTML-Edge-Cache-Status", "Hit");
      cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
      cachedResponse.headers.set("x-Edge-Cache-SWR-Mode", SERVE_STALE_WHILE_REVALIDATE ? "SWR" : "No-SWR");
      return cachedResponse;
    } else if (age <= SWR_WINDOW + 315360000) {
      if (SERVE_STALE_WHILE_REVALIDATE) {
        // Serve stale and revalidate in background
        cachedResponse = new Response(cachedResponse.body, cachedResponse);
        cachedResponse.headers.set("x-HTML-Edge-Cache-Status", "Stale-While-Revalidate");
        cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
        cachedResponse.headers.set("x-Edge-Cache-SWR-Mode", "SWR");
        event.waitUntil(
          revalidateCache(request, cacheKeyRequest, swrMetaKey, cacheVer, event)
        );
        return cachedResponse;
      } else {
        // Do NOT serve stale, wait for fresh (block until revalidated)
        let freshResponse = await fetchAndCacheFresh(request, cacheKeyRequest, swrMetaKey, event);
        freshResponse.headers.set("x-HTML-Edge-Cache-Status", "Revalidated");
        freshResponse.headers.set("x-Edge-Cache-Age", "0");
        freshResponse.headers.set("x-Edge-Cache-SWR-Mode", "No-SWR");
        return freshResponse;
      }
    }
    // If outside SWR window, treat as miss (fetch new)
  }
// Helper: fetch and cache fresh content synchronously (for No-SWR mode)
async function fetchAndCacheFresh(request, cacheKeyRequest, swrMetaKey, event) {
  let forwardRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
    redirect: request.redirect,
    credentials: request.credentials,
    cache: request.cache,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    signal: request.signal,
    duplex: request.duplex,
  });
  forwardRequest.headers.set(
    "x-HTML-Edge-Cache",
    "supports=cache|purgeall|bypass-cookies"
  );
  let response = await fetch(forwardRequest);
  const accept = request.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  if (response.status === 200 && isHTML) {
    let safeResponse = new Response(response.body, response);
    safeResponse.headers.delete("Set-Cookie");
    safeResponse.headers.set("Cache-Control", "public; max-age=315360000");
    if (typeof SMART_CACHE !== "undefined") {
      await SMART_CACHE.put(swrMetaKey, Math.floor(Date.now() / 1000).toString());
    }
    await caches.default.put(cacheKeyRequest, safeResponse.clone());
    return safeResponse;
  }
  return response;
}
// Helper: revalidate cache in background for SWR
async function revalidateCache(request, cacheKeyRequest, swrMetaKey, cacheVer, event) {
  try {
    let forwardRequest = new Request(request.url, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
      redirect: request.redirect,
      credentials: request.credentials,
      cache: request.cache,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      signal: request.signal,
      duplex: request.duplex,
    });
    forwardRequest.headers.set(
      "x-HTML-Edge-Cache",
      "supports=cache|purgeall|bypass-cookies"
    );
    let response = await fetch(forwardRequest);
    // Only cache if response is 200 and HTML
    const accept = request.headers.get("Accept");
    const isHTML = accept && accept.indexOf("text/html") >= 0;
    if (response.status === 200 && isHTML) {
      let safeResponse = new Response(response.body, response);
      safeResponse.headers.delete("Set-Cookie");
      safeResponse.headers.set("Cache-Control", "public; max-age=315360000");
      if (typeof SMART_CACHE !== "undefined") {
        await SMART_CACHE.put(swrMetaKey, Math.floor(Date.now() / 1000).toString());
      }
      await caches.default.put(cacheKeyRequest, safeResponse.clone());
    }
  } catch (e) {
    // Ignore errors in background revalidation
  }
}

  // Forward request to origin, preserving all properties (including credentials/cookies)
  let forwardRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
    redirect: request.redirect,
    credentials: request.credentials,
    cache: request.cache,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    signal: request.signal,
    duplex: request.duplex,
  });
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

  // Bypass caching if request has login/session cookies (WordPress, WooCommerce, PHPSESSID, etc.)
  if (hasLoginCookie(request)) {
    response = new Response(response.body, response);
    // Add debug headers for troubleshooting
    const debug = globalThis.__loginCookieDebug || {};
    response.headers.set("x-HTML-Edge-Cache-Status", "Bypass Login Cookie");
    response.headers.set("x-Edge-Debug-Cookies", (debug.all || []).join(", "));
    response.headers.set(
      "x-Edge-Debug-Login-Match",
      (debug.matched || []).join(", ")
    );
    return response;
  }
  // Returns true if the request has any login/session/auth cookies (case-insensitive, substring match)
  function hasLoginCookie(request) {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return false;
    const cookies = cookieHeader.split(";");
    let found = false;
    let matched = [];
    for (let cookie of cookies) {
      const name = cookie.split("=")[0].trim().toLowerCase();
      for (let prefix of LOGIN_COOKIE_PREFIXES) {
        if (name.includes(prefix.toLowerCase())) {
          matched.push(name);
          found = true;
        }
      }
    }
    // Attach debug info to globalThis for use in handleRequest
    globalThis.__loginCookieDebug = {
      all: cookies.map((c) => c.split("=")[0].trim()),
      matched,
    };
    return found;
  }
  if (response.status !== 200 || !isHTML) {
    response = new Response(response.body, response);
    response.headers.set(
      "x-HTML-Edge-Cache-Status",
      `Bypass Status/Type: ${response.status}`
    );
    return response;
  }

  // Bypass if response has Cache-Control: private or no-store
  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl && /private|no-store|no-cache/i.test(cacheControl)) {
    response = new Response(response.body, response);
    response.headers.set(
      "x-HTML-Edge-Cache-Status",
      "Bypass Cache-Control: " + cacheControl
    );
    return response;
  }

  // Cache the response (public, safe, static HTML)
  let safeResponse = new Response(response.body, response);
  safeResponse.headers.delete("Set-Cookie");
  safeResponse.headers.set("Cache-Control", "public; max-age=315360000");
  safeResponse.headers.set("x-HTML-Edge-Cache-Status", "Cached");
  if (typeof SMART_CACHE !== "undefined") {
    await SMART_CACHE.put(swrMetaKey, Math.floor(Date.now() / 1000).toString());
  }
  event.waitUntil(cache.put(cacheKeyRequest, safeResponse.clone()));
  return safeResponse;
}

// KV version helpers
async function getCurrentCacheVersion() {
  if (typeof SMART_CACHE !== "undefined") {
    let cacheVer = await SMART_CACHE.get("html_cache_version");
    if (cacheVer === null) {
      cacheVer = 0;
      await SMART_CACHE.put("html_cache_version", cacheVer.toString());
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
  if (typeof SMART_CACHE !== "undefined") {
    let cacheVer = await getCurrentCacheVersion();
    cacheVer++;
    await SMART_CACHE.put("html_cache_version", cacheVer.toString());
  }
}
