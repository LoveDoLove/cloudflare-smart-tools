export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    let originalHost = url.hostname;

    let mappedHost = await env.EDGE_CDN.get(originalHost);

    if (mappedHost) {
      url.hostname = mappedHost;
    }

    let new_request = new Request(url, request);
    
    // Cloudflare Worker: KV-based routing to external domains
    // User configures routing via KV (ROUTES_KV): key = path, value = target URL

    // Extract path from request
    const path = url.pathname;

    // Lookup target URL in KV
    let targetUrl = await env.ROUTES_KV.get(path);
    if (!targetUrl) {
      // No route found: return error
      return new Response(
        JSON.stringify({ error: 'No route configured for this path', path }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Proxy request to target URL
    try {
      // Build proxied request
      const proxyUrl = new URL(targetUrl);
      proxyUrl.search = url.search;
      const proxyRequest = new Request(proxyUrl.toString(), request);
      const response = await fetch(proxyRequest);
      return response;
    } catch (err) {
      // Proxy failed: return error
      return new Response(
        JSON.stringify({ error: 'Failed to proxy request', details: err.message }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  }
