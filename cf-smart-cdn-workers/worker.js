export default {
  async fetch(request, env) {
    // KV-based routing: best practice implementation
    const url = new URL(request.url);
    const path = url.pathname;
    const targetUrl = await env.DOMAIN_ROUTER_KV.get(path);
    if (!targetUrl) {
      // No route found: return error
      return new Response(
        JSON.stringify({ error: 'No route configured for this path', path }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate target URL
    let proxyUrl;
    try {
      proxyUrl = new URL(targetUrl);
    } catch (err) {
      // Malformed target URL
      return new Response(
        JSON.stringify({ error: 'Malformed target URL in KV', details: targetUrl }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Forward method, headers, and body
    const proxyRequest = new Request(proxyUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'manual',
    });

    // Add timeout for fetch (Cloudflare Workers: AbortController)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    let response;
    try {
      response = await fetch(proxyRequest, { signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      // Proxy failed: do not leak internal error details
      return new Response(
        JSON.stringify({ error: 'Failed to proxy request' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
