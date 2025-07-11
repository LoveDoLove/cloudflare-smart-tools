// Security: WordPress-specific login cookies (only applied when WordPress is detected)
const WORDPRESS_LOGIN_COOKIES = [
  "wordpress_logged_in",
  "wordpress_sec",
  "wordpress_test_cookie",
  "comment_author",
  "wp_postpass",
];

// Security: Authentication cookies that indicate logged-in users (universal)
const UNIVERSAL_AUTH_COOKIES = [
  "auth",
  "authenticated",
  "login",
  "logged_in",
  "user_id",
  "userid",
  "uid",
  "token",
  "access_token",
  "refresh_token",
  "jwt",
  "bearer",
];

// Security: Session cookies that should NOT bypass cache unless they indicate authentication
const FRAMEWORK_SESSION_COOKIES = [
  // Laravel
  { pattern: "laravel_session", requiresAuth: false, framework: "laravel" },
  { pattern: "XSRF-TOKEN", requiresAuth: false, framework: "laravel" },

  // Django
  { pattern: "sessionid", requiresAuth: false, framework: "django" },
  { pattern: "csrftoken", requiresAuth: false, framework: "django" },
  { pattern: "djangosessionid", requiresAuth: false, framework: "django" },

  // Express/Node.js
  { pattern: "connect.sid", requiresAuth: false, framework: "express" },
  { pattern: "express", requiresAuth: false, framework: "express" },

  // Rails
  { pattern: "_session", requiresAuth: false, framework: "rails" },
  { pattern: "rails_session", requiresAuth: false, framework: "rails" },

  // PHP Generic
  { pattern: "PHPSESSID", requiresAuth: false, framework: "php" },
  { pattern: "session", requiresAuth: false, framework: "php" },
  { pattern: "sess", requiresAuth: false, framework: "php" },
];

// WordPress-specific cookies (applied only when WordPress is detected)
const WORDPRESS_SPECIFIC_COOKIES = [
  "woocommerce_",
  "wc_",
  "wp_woocommerce_session",
  "edd_",
  "memberpress_",
  "wpsc_",
  "jevents_",
  "bbp_",
  "bp-",
  "learndash_",
  "lifterlms_",
  "wlm_",
  "s2member_",
  "pmpro_",
  "rcp_",
  "arm_",
  "ihc_",
  "wp-",
];

// cf-smart-cache-html-v3.js (v3.0 - User Authentication Cache Fix)
// Enhanced KV-based HTML edge caching for Cloudflare Workers
// Features:
// - FIXED: Cache poisoning where logged-in users see anonymous content (NEW in v3.0)
// - User-aware cache keys to prevent authentication state mixing (NEW in v3.0)
// - Proper Vary header handling for user-specific content (NEW in v3.0)
// - Smart detection for WordPress vs non-WordPress sites
// - Framework-aware cookie analysis to prevent 419 Page Expired errors
// - Intelligent distinction between auth cookies and session/CSRF tokens
// - Comprehensive security measures to prevent caching private content
// - Stale-While-Revalidate support for optimal performance
// - URL Pattern Bypass for admin/API endpoints
// - Framework-aware cookie detection (Laravel, Django, WordPress, generic)
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
  /\/profile/,
];

// Stale-While-Revalidate window (in seconds)
const SWR_WINDOW = 30; // Serve stale cache for up to 30 seconds while revalidating

// Config: If false, do NOT serve stale content while updating (matches Cloudflare dashboard option)
const SERVE_STALE_WHILE_REVALIDATE = true; // Set to false to disable SWR and always wait for fresh

// Maximum cache TTL in seconds (10 years as per Cloudflare docs)
const MAX_CACHE_TTL = 315360000;

// Security: Headers that indicate private content
const PRIVATE_CACHE_CONTROL_PATTERNS =
  /private|no-store|no-cache|must-revalidate/i;

// Security: Request headers that indicate authentication/private content
const AUTHENTICATION_HEADERS = [
  "authorization",
  "cookie",
  "x-requested-with",
  "x-csrf-token",
  "x-xsrf-token",
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
  /\/comments\/feed\/?$/,
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
  ERROR: "Error",
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
    const authState = getUserAuthenticationState(request);
    r.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.BYPASS_COOKIE);
    r.headers.set("x-Edge-Debug-Site-Type", debug.siteType || "unknown");
    r.headers.set("x-Edge-Debug-Auth-State", authState);
    r.headers.set("x-Edge-Debug-All-Cookies", (debug.all || []).join(", "));
    r.headers.set("x-Edge-Debug-Auth-Cookies", (debug.auth || []).join(", "));
    r.headers.set(
      "x-Edge-Debug-Session-Cookies",
      (debug.session || []).join(", ")
    );
    r.headers.set("x-Edge-Debug-Decision", debug.decision || "UNKNOWN");
    r.headers.set("x-Edge-Cache-Fix", "v3.0-user-auth-aware");
    r.headers.set(
      "x-HTML-Edge-Cache-Debug",
      `bypass=auth-cookie;site=${debug.siteType};auth=${(debug.auth || []).join(
        ","
      )};authstate=${authState}`
    );
    return r;
  }

  // Use user-state-aware versioned cache key
  const cacheVer = await getCurrentCacheVersion(request);
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
      const authState = getUserAuthenticationState(request);
      cachedResponse.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.HIT);
      cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
      cachedResponse.headers.set("x-Edge-Debug-Auth-State", authState);
      cachedResponse.headers.set("x-Edge-Cache-Fix", "v3.0-user-auth-aware");
      cachedResponse.headers.set(
        "x-Edge-Cache-SWR-Mode",
        SERVE_STALE_WHILE_REVALIDATE ? "SWR" : "No-SWR"
      );
      cachedResponse.headers.set(
        "x-HTML-Edge-Cache-Debug",
        "cache=hit;authstate=" + authState
      );
      return cachedResponse;
    } else if (age <= SWR_WINDOW + MAX_CACHE_TTL) {
      if (SERVE_STALE_WHILE_REVALIDATE) {
        // Serve stale and revalidate in background
        cachedResponse = new Response(cachedResponse.body, cachedResponse);
        const authStateStale = getUserAuthenticationState(request);
        cachedResponse.headers.set(
          "x-HTML-Edge-Cache-Status",
          CACHE_STATUS.STALE_WHILE_REVALIDATE
        );
        cachedResponse.headers.set("x-Edge-Cache-Age", age.toString());
        cachedResponse.headers.set("x-Edge-Debug-Auth-State", authStateStale);
        cachedResponse.headers.set("x-Edge-Cache-Fix", "v3.0-user-auth-aware");
        cachedResponse.headers.set("x-Edge-Cache-SWR-Mode", "SWR");
        cachedResponse.headers.set(
          "x-HTML-Edge-Cache-Debug",
          "cache=stale-while-revalidate;authstate=" + authStateStale
        );
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
        const authStateFresh = getUserAuthenticationState(request);
        freshResponse.headers.set(
          "x-HTML-Edge-Cache-Status",
          CACHE_STATUS.REVALIDATED
        );
        freshResponse.headers.set("x-Edge-Cache-Age", "0");
        freshResponse.headers.set("x-Edge-Debug-Auth-State", authStateFresh);
        freshResponse.headers.set("x-Edge-Cache-Fix", "v3.0-user-auth-aware");
        freshResponse.headers.set("x-Edge-Cache-SWR-Mode", "No-SWR");
        freshResponse.headers.set(
          "x-HTML-Edge-Cache-Debug",
          "cache=revalidated;authstate=" + authStateFresh
        );
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
      console.error("Background revalidation failed:", e);
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
  const authState = getUserAuthenticationState(request);
  safeResponse.headers.set("x-HTML-Edge-Cache-Status", CACHE_STATUS.CACHED);
  safeResponse.headers.set("x-Edge-Debug-Auth-State", authState);
  safeResponse.headers.set("x-Edge-Cache-Fix", "v3.0-user-auth-aware");
  safeResponse.headers.set(
    "x-HTML-Edge-Cache-Debug",
    "cache=cached;authstate=" + authState
  );
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
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // If response is not ok and we have retries left, retry
    if (!response.ok && retries > 0 && response.status >= 500) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
      return fetchWithRetry(request, options, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry on network errors if retries left
    if (
      retries > 0 &&
      (error.name === "AbortError" || error.name === "TypeError")
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1))
      );
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
    "ref",
  ].forEach((param) => url.searchParams.delete(param));
  return new Request(url.toString(), request);
}

// Security: Check for Authorization header according to RFC 7234
function hasAuthorizationHeader(request) {
  return request.headers.has("authorization");
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
  const cfCdnCacheControl = response.headers.get(
    "Cloudflare-CDN-Cache-Control"
  );
  if (
    cfCdnCacheControl &&
    PRIVATE_CACHE_CONTROL_PATTERNS.test(cfCdnCacheControl)
  ) {
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
      debug: `bypass=status-${response.status}`,
    };
  }

  if (!isHTML) {
    return {
      status: "Bypass Content Type",
      debug: "bypass=content-type",
    };
  }

  if (response.headers.has("Set-Cookie")) {
    return {
      status: "Bypass Set-Cookie Response",
      debug: "bypass=set-cookie",
    };
  }

  const cacheControl = response.headers.get("Cache-Control");
  if (cacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cacheControl)) {
    return {
      status: "Bypass Cache-Control: " + cacheControl,
      debug: "bypass=cache-control",
    };
  }

  const cdnCacheControl = response.headers.get("CDN-Cache-Control");
  if (cdnCacheControl && PRIVATE_CACHE_CONTROL_PATTERNS.test(cdnCacheControl)) {
    return {
      status: "Bypass CDN-Cache-Control: " + cdnCacheControl,
      debug: "bypass=cdn-cache-control",
    };
  }

  const cfCdnCacheControl = response.headers.get(
    "Cloudflare-CDN-Cache-Control"
  );
  if (
    cfCdnCacheControl &&
    PRIVATE_CACHE_CONTROL_PATTERNS.test(cfCdnCacheControl)
  ) {
    return {
      status: "Bypass Cloudflare-CDN-Cache-Control: " + cfCdnCacheControl,
      debug: "bypass=cf-cdn-cache-control",
    };
  }

  const varyHeader = response.headers.get("Vary");
  if (varyHeader && varyHeader.toLowerCase().includes("cookie")) {
    return {
      status: "Bypass Vary: Cookie",
      debug: "bypass=vary-cookie",
    };
  }

  return {
    status: "Bypass Unknown Reason",
    debug: "bypass=unknown",
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

  // CRITICAL FIX: Add Vary: Cookie header to prevent cache poisoning
  // This tells Cloudflare that responses vary based on cookies and should be cached separately
  // per user authentication state, as per RFC 7234 and Cloudflare best practices
  const existingVary = safeResponse.headers.get("Vary");
  if (existingVary) {
    if (!existingVary.toLowerCase().includes("cookie")) {
      safeResponse.headers.set("Vary", existingVary + ", Cookie");
    }
  } else {
    safeResponse.headers.set("Vary", "Cookie");
  }

  // Respect origin's cache control but ensure public caching
  const originalCacheControl = response.headers.get("Cache-Control");
  if (
    originalCacheControl &&
    !PRIVATE_CACHE_CONTROL_PATTERNS.test(originalCacheControl)
  ) {
    // Keep original cache control if it's safe
    safeResponse.headers.set("Cache-Control", originalCacheControl);
  } else {
    // Set safe default cache control
    safeResponse.headers.set(
      "Cache-Control",
      `public, max-age=${MAX_CACHE_TTL}`
    );
  }

  // Add edge cache headers for debugging
  safeResponse.headers.set("x-Edge-Cache-Version", "v3.0");
  safeResponse.headers.set("x-Edge-Cache-Date", new Date().toISOString());

  return safeResponse;
}
// CRITICAL FIX: User-state-aware cache versioning to prevent cross-contamination
// Each authentication state gets its own independent cache version
async function getCurrentCacheVersion(request = null) {
  if (typeof SMART_CACHE !== "undefined") {
    // Get user authentication state for state-specific cache versioning
    const authState = request ? getUserAuthenticationState(request) : "global";
    const cacheVersionKey = `html_cache_version_${authState}`;

    let cacheVer = await SMART_CACHE.get(cacheVersionKey);
    if (cacheVer === null) {
      cacheVer = 0;
      await SMART_CACHE.put(cacheVersionKey, cacheVer.toString());
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

  // CRITICAL FIX: Add user authentication state to cache key to prevent cache poisoning
  // This ensures logged-in users don't see cached anonymous content and vice versa
  const authState = getUserAuthenticationState(request);
  cacheUrl += "&cf_auth_state=" + authState;

  return new Request(cacheUrl);
}

// NEW: Generate consistent authentication state identifier for cache key
function getUserAuthenticationState(request) {
  const siteType = detectSiteType(request);
  const analysis = analyzeSessionCookies(request, siteType);

  // Create a stable hash of the authentication state
  if (analysis.hasAuth) {
    // For authenticated users, create a hash of their auth cookies
    // This ensures each user gets their own cache while maintaining privacy
    const authCookieString = analysis.details.auth.sort().join(",");
    return "auth_" + simpleHash(authCookieString);
  } else if (analysis.hasSession) {
    // For users with session cookies (but not authenticated), use session state
    return "session";
  } else {
    // For completely anonymous users
    return "anonymous";
  }
}

// Simple hash function for creating stable cache key components
function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

// CRITICAL FIX: User-state-aware cache purging to prevent cross-contamination
// Purge cache for specific authentication state or all states
async function purgeCache(targetAuthState = null) {
  if (typeof SMART_CACHE !== "undefined") {
    if (targetAuthState) {
      // Purge cache for specific authentication state only
      const cacheVersionKey = `html_cache_version_${targetAuthState}`;
      let cacheVer = await SMART_CACHE.get(cacheVersionKey);
      cacheVer = cacheVer ? parseInt(cacheVer) + 1 : 1;
      await SMART_CACHE.put(cacheVersionKey, cacheVer.toString());
    } else {
      // Purge cache for all authentication states (global purge)
      const authStates = ["anonymous", "session", "auth"];
      for (const authState of authStates) {
        const cacheVersionKey = `html_cache_version_${authState}`;
        let cacheVer = await SMART_CACHE.get(cacheVersionKey);
        cacheVer = cacheVer ? parseInt(cacheVer) + 1 : 1;
        await SMART_CACHE.put(cacheVersionKey, cacheVer.toString());
      }

      // Also purge any auth_* versioned caches (for authenticated users with different hashes)
      const keys = await SMART_CACHE.list({
        prefix: "html_cache_version_auth_",
      });
      for (const key of keys.keys) {
        let cacheVer = await SMART_CACHE.get(key.name);
        cacheVer = cacheVer ? parseInt(cacheVer) + 1 : 1;
        await SMART_CACHE.put(key.name, cacheVer.toString());
      }
    }
  }
}

// Site detection and cookie intelligence
function detectSiteType(request, response = null, content = null) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const cookies = request.headers.get("cookie") || "";

  // Check URL patterns first (most reliable)
  if (
    url.pathname.includes("/wp-") ||
    url.pathname.includes("wp-content") ||
    url.pathname.includes("wp-admin")
  ) {
    return "wordpress";
  }

  // Check cookies for framework indicators
  if (cookies.includes("laravel_session") || cookies.includes("XSRF-TOKEN")) {
    return "laravel";
  }

  if (cookies.includes("sessionid") && cookies.includes("csrftoken")) {
    return "django";
  }

  if (cookies.includes("wordpress_") || cookies.includes("wp_")) {
    return "wordpress";
  }

  // Check response headers if available
  if (response) {
    const serverHeader = response.headers.get("server") || "";
    const poweredBy = response.headers.get("x-powered-by") || "";

    if (
      poweredBy.toLowerCase().includes("laravel") ||
      serverHeader.toLowerCase().includes("laravel")
    ) {
      return "laravel";
    }

    if (
      poweredBy.toLowerCase().includes("django") ||
      serverHeader.toLowerCase().includes("django")
    ) {
      return "django";
    }
  }

  // Check content for framework indicators if available (least reliable but helpful)
  if (content && typeof content === "string") {
    if (
      content.includes("wp-content") ||
      content.includes("wordpress") ||
      content.includes("/wp/")
    ) {
      return "wordpress";
    }

    if (content.includes("laravel") || content.includes("Laravel")) {
      return "laravel";
    }

    if (content.includes("django") || content.includes("Django")) {
      return "django";
    }
  }

  return "generic";
}

// Smart cookie analysis based on detected site type
function analyzeSessionCookies(request, siteType) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return { hasAuth: false, hasSession: false, details: [] };

  const cookies = cookieHeader.split(";");
  let hasAuth = false;
  let hasSession = false;
  let authCookies = [];
  let sessionCookies = [];
  let allCookies = [];

  for (let cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (!trimmedCookie) continue;

    const name = trimmedCookie.split("=")[0].trim().toLowerCase();
    const value = trimmedCookie.split("=")[1] || "";
    allCookies.push(name);

    // Site-specific cookie analysis
    switch (siteType) {
      case "wordpress":
        // WordPress: Only treat actual login cookies as auth
        if (
          WORDPRESS_LOGIN_COOKIES.some((prefix) =>
            name.includes(prefix.toLowerCase())
          )
        ) {
          authCookies.push(name);
          hasAuth = true;
        }
        // WordPress session cookies (don't indicate auth)
        else if (
          WORDPRESS_SPECIFIC_COOKIES.some((prefix) =>
            name.includes(prefix.toLowerCase())
          )
        ) {
          sessionCookies.push(name);
          hasSession = true;
        }
        break;

      case "laravel":
        // Laravel: Distinguish between auth and CSRF/session tokens
        if (name === "laravel_session" || name === "xsrf-token") {
          // These are CSRF/session cookies, NOT auth cookies
          sessionCookies.push(name);
          hasSession = true;
        } else if (
          name.includes("remember_") ||
          name.includes("login_") ||
          name.includes("auth_")
        ) {
          authCookies.push(name);
          hasAuth = true;
        }
        break;

      case "django":
        // Django: sessionid and csrftoken are NOT auth cookies
        if (name === "sessionid" || name === "csrftoken") {
          sessionCookies.push(name);
          hasSession = true;
        } else if (
          name.includes("auth_user_id") ||
          name.includes("django_auth")
        ) {
          authCookies.push(name);
          hasAuth = true;
        }
        break;

      default:
        // Generic: Only universal auth patterns
        if (
          UNIVERSAL_AUTH_COOKIES.some((pattern) =>
            name.includes(pattern.toLowerCase())
          )
        ) {
          authCookies.push(name);
          hasAuth = true;
        }
        // Generic session patterns (don't indicate auth)
        else if (name.match(/^(phpsessid|session|sess|sid)$/i)) {
          sessionCookies.push(name);
          hasSession = true;
        }
    }
  }

  return {
    hasAuth,
    hasSession,
    siteType,
    details: {
      all: allCookies,
      auth: authCookies,
      session: sessionCookies,
      total: allCookies.length,
    },
  };
}

// Security: Enhanced login/session cookie detection with site intelligence
// Returns true ONLY if the request has actual authentication cookies (not just session/CSRF tokens)
function hasLoginCookie(request) {
  const siteType = detectSiteType(request);
  const analysis = analyzeSessionCookies(request, siteType);

  // Attach debug info to globalThis for use in handleRequest
  globalThis.__loginCookieDebug = {
    siteType,
    ...analysis.details,
    hasAuth: analysis.hasAuth,
    hasSession: analysis.hasSession,
    decision: analysis.hasAuth ? "BYPASS" : "CACHE",
  };

  // Only bypass cache for actual authentication cookies, not session/CSRF tokens
  return analysis.hasAuth;
}
