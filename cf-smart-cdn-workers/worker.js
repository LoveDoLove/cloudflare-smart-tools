export default {
  async fetch(request, env) {
    // KV-based routing: single implementation
    let url = new URL(request.url);
    let path = url.pathname;
    let targetUrl = await env.DOMAIN_ROUTER_KV.get(path);
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'No route configured for this path', path }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    try {
      let proxyUrl = new URL(targetUrl);
      proxyUrl.search = url.search;
      let proxyRequest = new Request(proxyUrl.toString(), request);
      let response = await fetch(proxyRequest);
      return response;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Failed to proxy request', details: err.message }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
