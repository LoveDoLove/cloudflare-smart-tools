export default {
  async fetch(request, env) {
    // Direct proxy: forward request to the same path on the target domain
    // Assume env.TARGET_DOMAIN is set to the base URL (e.g., 'https://example.com')
    const url = new URL(request.url);
    const targetDomain = env.TARGET_DOMAIN;
    if (!targetDomain) {
      return new Response(
        JSON.stringify({ error: 'No TARGET_DOMAIN configured in environment' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    let proxyUrl;
    try {
      proxyUrl = new URL(url.pathname + url.search, targetDomain);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Malformed TARGET_DOMAIN', details: targetDomain }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Forward method, headers, and body for all HTTP methods
    // Clone the request to ensure the body is readable
    let proxyRequestInit = {
      method: request.method,
      headers: request.headers,
      redirect: 'manual',
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Read the body as a stream or ArrayBuffer
      proxyRequestInit.body = request.body ? request.body : await request.clone().arrayBuffer();
    }
    const proxyRequest = new Request(proxyUrl.toString(), proxyRequestInit);
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
      return new Response(
        JSON.stringify({ error: 'Failed to proxy request' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
