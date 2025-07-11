/*
 Copyright (c) 2025 LoveDoLove

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Security: Comprehensive list of cookie prefixes that indicate logged-in or session users
// IMPORTANT: Replace this array with the exported JSON from the plugin admin (cf-smart-cache_export_bypass_cookies)
// This list covers WordPress, WooCommerce, popular plugins, and common session management systems
const LOGIN_COOKIE_PREFIXES = [
  // WordPress Core
  "wordpress_logged_in",
  "wp-",
  "wordpress_sec",
  "wordpress_test_cookie",
  
  // WordPress Comments & Posts
  "comment_",
  "wp_postpass",
  
  // WooCommerce
  "woocommerce_",
  "wc_",
  "wp_woocommerce_session",
  
  // Popular WordPress Plugins
  "edd_", // Easy Digital Downloads
  "memberpress_",
  "wpsc_", // WP Shopping Cart
  "jevents_",
  "bbp_", // bbPress
  "bp-", // BuddyPress
  "learndash_",
  "lifterlms_",
  "wlm_", // WishList Member
  "s2member_",
  "pmpro_", // Paid Memberships Pro
  "rcp_", // Restrict Content Pro
  "arm_", // ARMember
  "ihc_", // Ultimate Membership Pro
  
  // General Session Management
  "PHPSESSID",
  "session",
  "sess",
  "sid",
  "sessionid",
  "auth",
  "token",
  "user",
  "userid",
  "uid",
  "login",
  "jwt",
  "bearer",
  
  // Laravel & Other Frameworks
  "laravel_session",
  "symfony",
  "django",
  "rails_session",
  "express",
  "connect.sid",
  
  // Shopping Carts & E-commerce
  "cart",
  "checkout",
  "customer",
  "order",
  
  // CRM & Marketing
  "hubspot",
  "salesforce",
  "marketo",
  
  // Security & 2FA
  "2fa",
  "mfa",
  "otp",
  "verification"
];

// cf-smart-cache-html-v2.js
// Enhanced KV-based HTML edge caching for Cloudflare Workers
// Features:
// - Comprehensive security measures to prevent caching private content
// - Stale-While-Revalidate support for optimal performance
// - URL Pattern Bypass for admin/API endpoints
// - Advanced cookie detection for session management
// - Load balancing friendly with proper request handling
// - RFC 7234 compliant cache behavior
// - Support for Cloudflare-specific cache control headers

// URL patterns to bypass cache (regex) - Enhanced for WordPress security
const BYPASS_URL_PATTERNS = [
  /\/wp-admin\//,
  /\/wp-login\.php/,
  /\/wp-register\.php/,
  /\/wp-cron\.php/,
  /\/wp-comments-post\.php/,
  /\/api\//,
  /\/admin(\/|$)/,
  /\/login(\/|$)/,
  /\/dashboard(\/|$)/,
  /\/checkout/,
  /\/cart/,
  /\/account/,
  /\/my-account/,
  /\/user/,
  /\/profile/
];

// Stale-While-Revalidate window (in seconds)
const SWR_WINDOW = 30; // Serve stale cache for up to 30 seconds while revalidating

// Config: If false, do NOT serve stale content while updating (matches Cloudflare dashboard option)
const SERVE_STALE_WHILE_REVALIDATE = true; // Set to false to disable SWR and always wait for fresh

// Maximum cache TTL in seconds (10 years as per Cloudflare docs)
const MAX_CACHE_TTL = 315360000;

// Security: Headers that indicate private content
const PRIVATE_CACHE_CONTROL_PATTERNS = /private|no-store|no-cache|must-revalidate/i;

// Security: Request headers that indicate authentication/private content
const AUTHENTICATION_HEADERS = [
  'authorization',
  'cookie',
  'x-requested-with',
  'x-csrf-token',
  'x-xsrf-token'
];

// Additional WordPress/CMS specific patterns to bypass
const WORDPRESS_PRIVATE_PATTERNS = [
  /\/wp-content\/.*\/cache\//,
  /\/wp-includes\/.*\.php/,
  /\/xmlrpc\.php/,
  /\/wp-cron\.php/,
  /\/wp-config\.php/,
  /\/\.well-known\//,
  /\/sitemap.*\.xml$/,
  /\/feed\/?$/,
  /\/comments\/feed\/?$/
];

// IMPORTANT: Either a Key/Value Namespace must be bound to this worker script
// using the variable name SMART_CACHE, or the API parameters below should be configured.
// KV is recommended if possible since it can purge just the HTML instead of the full cache.

const CLOUDFLARE_API = {
  email: "", // From https://dash.cloudflare.com/profile
  key: "", // Global API Key from https://dash.cloudflare.com/profile
  zone: "", // "Zone ID" from the API section of the dashboard overview page https://dash.cloudflare.com/
};

// Load balancing and performance configuration
const ORIGIN_TIMEOUT = 30000; // 30 seconds timeout for origin requests
const MAX_RETRIES = 2; // Maximum retries for failed origin requests
const RETRY_DELAY = 1000; // Base delay between retries (ms)

// Enhanced error codes for better debugging
const CACHE_STATUS = {
  HIT: "Hit",
  MISS: "Miss", 
  BYPASS_URL: "Bypass URL Pattern",
  BYPASS_COOKIE: "Bypass Login Cookie",
  BYPASS_AUTH: "Bypass Authorization Header",
  BYPASS_WP_PRIVATE: "Bypass WordPress Private Content",
  BYPASS_STATUS: "Bypass Status Code",
  BYPASS_CONTENT_TYPE: "Bypass Content Type",
  BYPASS_SET_COOKIE: "Bypass Set-Cookie Response",
  BYPASS_CACHE_CONTROL: "Bypass Cache-Control",
  BYPASS_CDN_CACHE_CONTROL: "Bypass CDN-Cache-Control",
  BYPASS_VARY_COOKIE: "Bypass Vary: Cookie",
  STALE_WHILE_REVALIDATE: "Stale-While-Revalidate",
  REVALIDATED: "Revalidated",
  CACHED: "Cached",
  PURGED: "Purged",
  ERROR: "Error"
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Security: Only process GET requests for HTML content
  const accept = request.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  
  // Early bypass for non-GET requests or non-HTML content
  if (request.method !== "GET" || !isHTML) {
    return fetch(request);
  }

  // Security: Check for Authorization header - bypass cache if present
  if (hasAuthorizationHeader(request)) {
    let resp = await fetchWithRetry(request);
    let r = new Response(resp.body, resp);
    r.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.BYPASS_AUTH);
    r.headers.set("x-HTML-Edge-Cache-Debug", "bypass=authorization");
    return r;
  }

  // URL pattern bypass (admin, API, etc.)
  for (let pattern of BYPASS_URL_PATTERNS) {
    if (pattern.test(url.pathname)) {
      let resp = await fetchWithRetry(request);
      let r = new Response(resp.body, resp);
      r.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.BYPASS_URL);
      r.headers.set("x-Edge-Bypass-Pattern", pattern.toString());
      r.headers.set("x-HTML-Edge-Cache-Debug", "bypass=url-pattern");
      return r;
    }
  }

  // WordPress/CMS specific private content bypass
  for (let pattern of WORDPRESS_PRIVATE_PATTERNS) {
    if (pattern.test(url.pathname)) {
      let resp = await fetchWithRetry(request);
      let r = new Response(resp.body, resp);
      r.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.BYPASS_WP_PRIVATE);
      r.headers.set("x-Edge-Bypass-Pattern", pattern.toString());
      r.headers.set("x-HTML-Edge-Cache-Debug", "bypass=wp-private");
      return r;
    }
  }

  // Security: If the request has login/session/auth cookies, NEVER cache or serve from cache
  if (hasLoginCookie(request)) {
    let resp = await fetchWithRetry(request);
    let r = new Response(resp.body, resp);
    const debug = globalThis.__loginCookieDebug || {};
    r.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.BYPASS_COOKIE);
    r.headers.set("x-Edge-Debug-Cookies", (debug.all || []).join(", "));
    r.headers.set("x-Edge-Debug-Login-Match", (debug.matched || []).join(", "));
    r.headers.set("x-HTML-Edge-Cache-Debug", `bypass=login-cookie;matched=${(debug.matched || []).join(",")}`);
    return r;
  }

  // Use versioned cache key
  const cacheVer = await getCurrentCacheVersion();
  const cacheKeyRequest = generateCacheRequest(
    normalizeRequestForCache(request),
    cacheVer
  );
  let cache = caches.default;
  let cachedResponse = await cache.match(cacheKeyRequest);
  let swrMetaKey = cacheKeyRequest.url + "::swr_meta";
  let swrMeta = undefined;
  
  // Check cache and serve if valid
  if (cachedResponse) {
    // Try to get SWR metadata from KV (timestamp of last update)
    if (typeof SMART_CACHE !== "undefined") {
      swrMeta = await SMART_CACHE.get(swrMetaKey);
    }
    let now = Math.floor(Date.now() / 1000);
    let lastUpdate = swrMeta ? parseInt(swrMeta) : now;
    let age = now - lastUpdate;
    
    if (age <= 0 || age < MAX_CACHE_TTL) {
      // If not stale (within max-age), serve as fresh
      cachedResponse = new Response(cachedResponse.body, cachedResponse);
      cachedResponse.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.HIT);
      cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
      cachedResponse.headers.set(
        "x-Edge-Cache-SWR-Mode",
        SERVE_STALE_WHILE_REVALIDATE ? "SWR" : "No-SWR"
      );
      cachedResponse.headers.set("x-HTML-Edge-Cache-Debug", "cache=hit");
      return cachedResponse;
    } else if (age <= SWR_WINDOW + MAX_CACHE_TTL) {
      if (SERVE_STALE_WHILE_REVALIDATE) {
        // Serve stale and revalidate in background
        cachedResponse = new Response(cachedResponse.body, cachedResponse);
        cachedResponse.headers.set(
          "x-HTML-Edge-Cache-Status",
          CACHE_STATUS.STALE_WHILE_REVALIDATE
        );
        cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
        cachedResponse.headers.set("x-Edge-Cache-SWR-Mode", "SWR");
        cachedResponse.headers.set("x-HTML-Edge-Cache-Debug", "cache=stale-while-revalidate");
        event.waitUntil(
          revalidateCache(request, cacheKeyRequest, swrMetaKey, cacheVer, event)
        );
        return cachedResponse;
      } else {
        // Do NOT serve stale, wait for fresh (block until revalidated)
        let freshResponse = await fetchAndCacheFresh(
          request,
          cacheKeyRequest,
          swrMetaKey,
          event
        );
        freshResponse.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.REVALIDATED);
        freshResponse.headers.set("x-Edge-Cache-Age", "0");
        freshResponse.headers.set("x-Edge-Cache-SWR-Mode", "No-SWR");
        freshResponse.headers.set("x-HTML-Edge-Cache-Debug", "cache=revalidated");
        return freshResponse;
      }
    }
    // If outside SWR window, treat as miss (fetch new)
  }
  // Helper: fetch and cache fresh content synchronously (for No-SWR mode)
  async function fetchAndCacheFresh(
    request,
    cacheKeyRequest,
    swrMetaKey,
    event
  ) {
    let forwardRequest = createForwardRequest(request);
    let response = await fetchWithRetry(forwardRequest, {
      cf: {
        cacheTtl: 3600,
        cacheEverything: true,
      },
    });
    
    // Security: Validate response before caching
    if (shouldCacheResponse(response, request)) {
      let safeResponse = createSafeResponse(response);
      if (typeof SMART_CACHE !== "undefined") {
        await SMART_CACHE.put(
          swrMetaKey,
          Math.floor(Date.now() / 1000).toString()
        );
      }
      await caches.default.put(cacheKeyRequest, safeResponse.clone());
      return safeResponse;
    }
    return response;
  }
  
  // Helper: revalidate cache in background for SWR
  async function revalidateCache(
    request,
    cacheKeyRequest,
    swrMetaKey,
    cacheVer,
    event
  ) {
    try {
      let forwardRequest = createForwardRequest(request);
      let response = await fetchWithRetry(forwardRequest, {
        cf: {
          cacheTtl: 3600,
          cacheEverything: true,
        },
      });
      
      // Security: Only cache if response is safe and valid
      if (shouldCacheResponse(response, request)) {
        let safeResponse = createSafeResponse(response);
        if (typeof SMART_CACHE !== "undefined") {
          await SMART_CACHE.put(
            swrMetaKey,
            Math.floor(Date.now() / 1000).toString()
          );
        }
        await caches.default.put(cacheKeyRequest, safeResponse.clone());
      }
    } catch (e) {
      // Log errors in background revalidation for debugging
      console.error('Background revalidation failed:', e);
    }
  }

  // Forward request to origin, preserving all properties (including credentials/cookies)
  let forwardRequest = createForwardRequest(request);
  let response = await fetchWithRetry(forwardRequest, {
    cf: {
      cacheTtl: 3600,
      cacheEverything: true,
    },
  });

  // Purge logic: if origin signals purge, bump version
  const edgeCacheHeader = response.headers.get("x-HTML-Edge-Cache");
  if (edgeCacheHeader && edgeCacheHeader.includes("purgeall")) {
    await purgeCache();
    response = new Response(response.body, response);
    response.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.PURGED);
    response.headers.set("x-HTML-Edge-Cache-Debug", "cache=purged");
    return response;
  }

  // Security: Enhanced response validation before caching
  if (!shouldCacheResponse(response, request)) {
    response = new Response(response.body, response);
    const reason = getCacheBypassReason(response, request);
    response.headers.set("x-HTML-Edge-Cache-Status", reason.status);
    response.headers.set("x-HTML-Edge-Cache-Debug", reason.debug);
    return response;
  }

  // Cache the response (public, safe, static HTML)
  let safeResponse = createSafeResponse(response);
  safeResponse.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.CACHED);
  safeResponse.headers.set("x-HTML-Edge-Cache-Debug", "cache=cached");
  if (typeof SMART_CACHE !== "undefined") {
    await SMART_CACHE.put(swrMetaKey, Math.floor(Date.now() / 1000).toString());
  }
  event.waitUntil(cache.put(cacheKeyRequest, safeResponse.clone()));
  return safeResponse;
}

// Load balancing: Enhanced fetch with retry logic and timeout handling
async function fetchWithRetry(request, options = {}, retries = MAX_RETRIES) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT);
  
  try {
    const response = await fetch(request, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    // If response is not ok and we have retries left, retry
    if (!response.ok && retries > 0 && response.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(request, options, retries - 1);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry on network errors if retries left
    if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(request, options, retries - 1);
    }
    
    throw error;
  }
}
function normalizeRequestForCache(request) {
  let url = new URL(request.url);
  // Remove common tracking/query params
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "_ga",
    "_gid",
    "fb_action_ids",
    "fb_action_types",
    "fb_source",
    "mc_cid",
    "mc_eid",
    "_kx",
    "zanpid",
    "kw",
    "hash",
    "ref"
  ].forEach((param) => url.searchParams.delete(param));
  return new Request(url.toString(), request);
}

// Security: Check for Authorization header according to RFC 7234
function hasAuthorizationHeader(request) {
  return request.headers.has('authorization');
}

// Security: Create forward request with proper headers
function createForwardRequest(request) {
  let forwardRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
    redirect: request.redirect,
    credentials: request.credentials,
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
  return forwardRequest;
}

// Security: Comprehensive response validation for caching
function shouldCacheResponse(response, request) {
  const accept = request.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  
  // Must be 200 OK and HTML content
  if (response.status !== 200 || !isHTML) {
    return false;
  }
  
  // Security: Never cache responses with Set-Cookie header
  if (response.headers.has("Set-Cookie")) {
    return false;
  }
  
  // Security: Respect Cache-Control directives
  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cacheControl)) {
    return false;
  }
  
  // Security: Check for CDN-Cache-Control (Cloudflare specific)
  const cdnCacheControl = response.headers.get("CDN-Cache-Control");
  if (cdnCacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cdnCacheControl)) {
    return false;
  }
  
  // Security: Check for Cloudflare-CDN-Cache-Control
  const cfCdnCacheControl = response.headers.get("Cloudflare-CDN-Cache-Control");
  if (cfCdnCacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cfCdnCacheControl)) {
    return false;
  }
  
  // Security: Never cache responses with Vary: Cookie header
  const varyHeader = response.headers.get("Vary");
  if (varyHeader && varyHeader.toLowerCase().includes("cookie")) {
    return false;
  }
  
  return true;
}

// Security: Get detailed reason for cache bypass
function getCacheBypassReason(response, request) {
  const accept = request.headers.get("Accept");
  const isHTML = accept && accept.indexOf("text/html") >= 0;
  
  if (response.status !== 200) {
    return {
      status: `Bypass Status Code: ${response.status}`,
      debug: `bypass=status-${response.status}`
    };
  }
  
  if (!isHTML) {
    return {
      status: "Bypass Content Type",
      debug: "bypass=content-type"
    };
  }
  
  if (response.headers.has("Set-Cookie")) {
    return {
      status: "Bypass Set-Cookie Response",
      debug: "bypass=set-cookie"
    };
  }
  
  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cacheControl)) {
    return {
      status: "Bypass Cache-Control: " + cacheControl,
      debug: "bypass=cache-control"
    };
  }
  
  const cdnCacheControl = response.headers.get("CDN-Cache-Control");
  if (cdnCacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cdnCacheControl)) {
    return {
      status: "Bypass CDN-Cache-Control: " + cdnCacheControl,
      debug: "bypass=cdn-cache-control"
    };
  }
  
  const cfCdnCacheControl = response.headers.get("Cloudflare-CDN-Cache-Control");
  if (cfCdnCacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cfCdnCacheControl)) {
    return {
      status: "Bypass Cloudflare-CDN-Cache-Control: " + cfCdnCacheControl,
      debug: "bypass=cf-cdn-cache-control"
    };
  }
  
  const varyHeader = response.headers.get("Vary");
  if (varyHeader && varyHeader.toLowerCase().includes("cookie")) {
    return {
      status: "Bypass Vary: Cookie",
      debug: "bypass=vary-cookie"
    };
  }
  
  return {
    status: "Bypass Unknown Reason",
    debug: "bypass=unknown"
  };
}

// Security: Create safe response for caching (remove sensitive headers)
function createSafeResponse(response) {
  let safeResponse = new Response(response.body, response);
  
  // Security: Remove all potentially sensitive headers
  safeResponse.headers.delete("Set-Cookie");
  safeResponse.headers.delete("Set-Cookie2"); // Legacy header
  safeResponse.headers.delete("Authorization");
  safeResponse.headers.delete("WWW-Authenticate");
  safeResponse.headers.delete("Proxy-Authorization");
  safeResponse.headers.delete("Proxy-Authenticate");
  
  // Respect origin's cache control but ensure public caching
  const originalCacheControl = response.headers.get("Cache-Control");
  if (originalCacheControl && !PRIVATE_CACHE_CONTROL_PATTERNS.test(originalCacheControl)) {
    // Keep original cache control if it's safe
    safeResponse.headers.set("Cache-Control", originalCacheControl);
  } else {
    // Set safe default cache control
    safeResponse.headers.set("Cache-Control", `public, max-age=${MAX_CACHE_TTL}`);
  }
  
  // Add edge cache headers for debugging
  safeResponse.headers.set("x-Edge-Cache-Version", "v2.1");
  safeResponse.headers.set("x-Edge-Cache-Date", new Date().toISOString());
  
  return safeResponse;
}
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

// Security: Enhanced login/session cookie detection
// Returns true if the request has any login/session/auth cookies (case-insensitive, substring match)
function hasLoginCookie(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(";");
  let found = false;
  let matched = [];
  let allCookies = [];
  
  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (!trimmedCookie) continue;
    
    const name = trimmedCookie.split("=")[0].trim().toLowerCase();
    allCookies.push(name);
    
    // Check against known login cookie prefixes
    for (let prefix of LOGIN_COOKIE_PREFIXES) {
      if (name.includes(prefix.toLowerCase())) {
        matched.push(name);
        found = true;
        break;
      }
    }
    
    // Additional security checks for common session patterns
    if (!found) {
      // Check for generic session patterns
      if (name.match(/^(sess|session|sid|s|userid|uid|token|auth|login|user|jwt|bearer)(_|\.|-)?/i)) {
        matched.push(name);
        found = true;
      }
      
      // Check for encrypted/hashed cookie names (often used for sessions)
      if (name.length > 20 && name.match(/^[a-f0-9]{20,}$/i)) {
        matched.push(name);
        found = true;
      }
    }
  }
  
  // Attach debug info to globalThis for use in handleRequest
  globalThis.__loginCookieDebug = {
    all: allCookies,
    matched,
    total: allCookies.length,
    loginCookies: matched.length
  };
  
  return found;
}
