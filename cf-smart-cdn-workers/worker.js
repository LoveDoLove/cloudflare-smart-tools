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

  // 创建一个新的请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  // 获取目标服务器的响应
  let response = await fetch(modifiedRequest);

  // 检查响应类型并重写内容
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html') || contentType.includes('text/css') || contentType.includes('application/javascript')) {
    // 将响应内容转为文本
    let text = await response.text();

    // 替换内容：将 targetDomain 替换为 replaceDomain
    const regex = new RegExp(targetDomain.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), 'g');
    text = text.replace(regex, replaceDomain);

    // 返回修改后的响应
    return new Response(text, {
      status: response.status,
      headers: response.headers
    });
  }

  // 如果不是需要重写的类型，则直接返回原始响应
  return response;
}
