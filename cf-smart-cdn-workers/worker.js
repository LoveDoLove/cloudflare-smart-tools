// To use environment variables in Cloudflare Workers, define them in wrangler.toml under [vars]
// Example:
// [vars]
// TARGET_DOMAIN = "example.com"
// REPLACE_DOMAIN = "yoursite.com"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  const url = new URL(request.url);

  // Use environment variable for the target domain
  const targetDomain = typeof TARGET_DOMAIN !== 'undefined' ? TARGET_DOMAIN : 'example.com';
  const replaceDomain = typeof REPLACE_DOMAIN !== 'undefined' ? REPLACE_DOMAIN : 'yoursite.com';
  const targetUrl = `https://${targetDomain}${url.pathname}`;

  // Create a new request to the target server
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  // Get the response from the target server
  let response = await fetch(modifiedRequest);

  // Check response type and rewrite content if needed
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html') || contentType.includes('text/css') || contentType.includes('application/javascript')) {
    // Convert response content to text
    let text = await response.text();

    // Replace content: replace targetDomain with replaceDomain
    const regex = new RegExp(targetDomain.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), 'g');
    text = text.replace(regex, replaceDomain);

    // Return the modified response
    return new Response(text, {
      status: response.status,
      headers: response.headers
    });
  }

  // If not a type that needs rewriting, return the original response
  return response;
}
