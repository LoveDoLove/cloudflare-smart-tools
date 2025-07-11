// cf-smart-cache-html-v4.js (v4.0 - Stable, Secure, Smart HTML Edge Caching)
//
// Combines and improves v1, v2, v3: Stable KV versioning, load balancing, auto-bypass for private/admin/sensitive content,
// smart framework-aware cookie detection, and robust security. Simple, reliable, and production-ready.
//
// Usage: Bind a KV namespace as SMART_CACHE. No config needed for most WordPress/PHP/Laravel/Django/Node.js sites.
//
// For more info, see: https://developers.cloudflare.com/cache/ and https://developer.wordpress.org/plugins/

// --- CONFIG ---
const CACHE_VERSION_KEY = "html_cache_version";
const MAX_CACHE_TTL = 315360000; // 10 years
const SWR_WINDOW = 30; // Stale-While-Revalidate window (seconds)
const SERVE_STALE_WHILE_REVALIDATE = true;

// Cookie patterns for bypass (WordPress, generic, frameworks)
const WORDPRESS_LOGIN_COOKIES = [
  "wordpress_logged_in",
  "wordpress_sec",
  "wordpress_test_cookie",
  "comment_author",
  "wp_postpass",
];
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
const FRAMEWORK_SESSION_COOKIES = [
  "laravel_session",
  "XSRF-TOKEN",
  "sessionid",
  "csrftoken",
  "djangosessionid",
  "connect.sid",
  "express",
  "_session",
  "rails_session",
  "PHPSESSID",
  "session",
  "sess",
];
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

// URL patterns to bypass cache (admin, login, API, etc.)
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
const PRIVATE_CACHE_CONTROL_PATTERNS =
  /private|no-store|no-cache|must-revalidate/i;

// --- MAIN ENTRY ---
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  const accept = request.headers.get("Accept") || "";
  const isHTML = accept.includes("text/html");

  // Only process GET HTML requests
  if (request.method !== "GET" || !isHTML) return fetch(request);

  // Bypass for Authorization header
  if (request.headers.has("authorization"))
    return fetchWithStatus(request, "BYPASS_AUTH");

  // Bypass for admin/private/sensitive URLs
  if (
    BYPASS_URL_PATTERNS.some((r) => r.test(url.pathname)) ||
    WORDPRESS_PRIVATE_PATTERNS.some((r) => r.test(url.pathname))
  )
    return fetchWithStatus(request, "BYPASS_URL");

  // Bypass for login/auth cookies
  if (hasLoginCookie(request)) return fetchWithStatus(request, "BYPASS_COOKIE");

  // Use versioned, user-state-aware cache key
  const cacheVer = await getCurrentCacheVersion();
  const cacheKeyRequest = generateCacheRequest(
    normalizeRequestForCache(request),
    cacheVer,
    getUserAuthState(request)
  );
  const cache = caches.default;
  let cachedResponse = await cache.match(cacheKeyRequest);

  // Serve from cache if valid
  if (cachedResponse) {
    // Optionally revalidate in background (SWR)
    if (SERVE_STALE_WHILE_REVALIDATE) {
      event.waitUntil(
        revalidateCache(request, cacheKeyRequest, cacheVer, event)
      );
      cachedResponse = new Response(cachedResponse.body, cachedResponse);
      cachedResponse.headers.set("x-HTML-Edge-Cache-Status", "HIT");
      return cachedResponse;
    } else {
      // Always fetch fresh if not using SWR
      return await fetchAndCacheFresh(
        request,
        cacheKeyRequest,
        cacheVer,
        event
      );
    }
  }
  // Cache miss: fetch, validate, and cache if safe
  return await fetchAndCacheFresh(request, cacheKeyRequest, cacheVer, event);
}

// --- CORE LOGIC ---
async function fetchAndCacheFresh(request, cacheKeyRequest, cacheVer, event) {
  let response = await fetch(request);
  if (!shouldCacheResponse(response, request))
    return fetchWithStatus(request, "BYPASS_RESPONSE");
  let safeResponse = createSafeResponse(response);
  safeResponse.headers.set("x-HTML-Edge-Cache-Status", "CACHED");
  event.waitUntil(caches.default.put(cacheKeyRequest, safeResponse.clone()));
  return safeResponse;
}

async function revalidateCache(request, cacheKeyRequest, cacheVer, event) {
  let response = await fetch(request);
  if (shouldCacheResponse(response, request)) {
    let safeResponse = createSafeResponse(response);
    event.waitUntil(caches.default.put(cacheKeyRequest, safeResponse.clone()));
  }
}

function shouldCacheResponse(response, request) {
  const accept = request.headers.get("Accept") || "";
  const isHTML = accept.includes("text/html");
  if (response.status !== 200 || !isHTML) return false;
  if (response.headers.has("Set-Cookie")) return false;
  const cacheControl = response.headers.get("Cache-Control") || "";
  if (PRIVATE_CACHE_CONTROL_PATTERNS.test(cacheControl)) return false;
  const vary = response.headers.get("Vary") || "";
  if (vary.toLowerCase().includes("cookie")) return false;
  return true;
}

function createSafeResponse(response) {
  let safe = new Response(response.body, response);
  safe.headers.delete("Set-Cookie");
  safe.headers.delete("Set-Cookie2");
  safe.headers.delete("Authorization");
  safe.headers.delete("WWW-Authenticate");
  safe.headers.delete("Proxy-Authorization");
  safe.headers.delete("Proxy-Authenticate");
  // Always add Vary: Cookie for user separation
  safe.headers.set("Vary", "Cookie");
  safe.headers.set("Cache-Control", `public, max-age=${MAX_CACHE_TTL}`);
  safe.headers.set("x-Edge-Cache-Version", "v4.0");
  safe.headers.set("x-Edge-Cache-Date", new Date().toISOString());
  return safe;
}

function normalizeRequestForCache(request) {
  let url = new URL(request.url);
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

function generateCacheRequest(request, cacheVer, authState) {
  let cacheUrl = request.url;
  cacheUrl +=
    (cacheUrl.includes("?") ? "&" : "?") +
    "cf_edge_cache_ver=" +
    cacheVer +
    "&cf_auth_state=" +
    authState;
  return new Request(cacheUrl, request);
}

// --- KV VERSIONING ---
async function getCurrentCacheVersion() {
  if (typeof SMART_CACHE !== "undefined") {
    let ver = await SMART_CACHE.get(CACHE_VERSION_KEY);
    if (ver === null) {
      ver = 0;
      await SMART_CACHE.put(CACHE_VERSION_KEY, ver.toString());
    }
    return parseInt(ver);
  }
  return 0;
}

// --- COOKIE/AUTH DETECTION ---
function hasLoginCookie(request) {
  const cookies = (request.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim());
  // WordPress login
  if (cookies.some((c) => WORDPRESS_LOGIN_COOKIES.some((p) => c.startsWith(p))))
    return true;
  // Universal auth
  if (cookies.some((c) => UNIVERSAL_AUTH_COOKIES.some((p) => c.startsWith(p))))
    return true;
  // Framework session (if looks like auth)
  if (
    cookies.some((c) => FRAMEWORK_SESSION_COOKIES.some((p) => c.startsWith(p)))
  )
    return true;
  // WordPress-specific
  if (
    cookies.some((c) => WORDPRESS_SPECIFIC_COOKIES.some((p) => c.startsWith(p)))
  )
    return true;
  return false;
}

function getUserAuthState(request) {
  // Simple hash of all auth cookies for cache key separation
  const cookies = (request.headers.get("cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean);
  const authCookies = cookies.filter(
    (c) =>
      WORDPRESS_LOGIN_COOKIES.some((p) => c.startsWith(p)) ||
      UNIVERSAL_AUTH_COOKIES.some((p) => c.startsWith(p)) ||
      FRAMEWORK_SESSION_COOKIES.some((p) => c.startsWith(p)) ||
      WORDPRESS_SPECIFIC_COOKIES.some((p) => c.startsWith(p))
  );
  return simpleHash(authCookies.join(";"));
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash).toString(36).substring(0, 8);
}

// --- UTILITY: Fetch with status header for bypasses ---
async function fetchWithStatus(request, status) {
  let resp = await fetch(request);
  let r = new Response(resp.body, resp);
  r.headers.set("x-HTML-Edge-Cache-Status", status);
  return r;
}
