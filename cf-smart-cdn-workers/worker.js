export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    let originalHost = url.hostname;

    let mappedHost = await env.EDGE_CDN.get(originalHost);

    if (mappedHost) {
      url.hostname = mappedHost;
    }

    let new_request = new Request(url, request);
    
    return fetch(new_request);
  }
};
