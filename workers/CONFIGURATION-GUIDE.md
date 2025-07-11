# Cloudflare Smart Cache Worker - Configuration Guide

## Quick Setup Guide

### 1. Worker Deployment

1. **Upload the Worker Script**
   - Copy the contents of `cf-smart-cache-html-v2.js`
   - Paste into the Cloudflare Workers editor
   - Save and deploy

2. **KV Namespace Setup** (Recommended)
   - Create a KV namespace called `SMART_CACHE`
   - Bind it to your worker with variable name `SMART_CACHE`
   - This enables granular cache purging

3. **Route Configuration**
   - Add routes for your domain (e.g., `example.com/*`)
   - Ensure the worker runs on all pages you want to cache

### 2. Security Configuration

#### Cookie Prefixes
Customize the `LOGIN_COOKIE_PREFIXES` array based on your WordPress setup:

```javascript
const LOGIN_COOKIE_PREFIXES = [
  // WordPress Core (Keep these)
  "wordpress_logged_in",
  "wp-",
  "wordpress_sec",
  "wordpress_test_cookie",
  "comment_",
  "wp_postpass",
  
  // Add your specific plugins
  "your_plugin_session_",
  "custom_auth_",
  
  // E-commerce (if applicable)
  "woocommerce_",
  "wc_",
  "edd_",
];
```

#### URL Patterns
Add custom admin/private URLs to `BYPASS_URL_PATTERNS`:

```javascript
const BYPASS_URL_PATTERNS = [
  // WordPress defaults (keep these)
  /\/wp-admin\//,
  /\/wp-login\.php/,
  
  // Custom admin areas
  /\/my-custom-admin\//,
  /\/member-portal\//,
  /\/user-dashboard\//,
];
```

### 3. Performance Tuning

#### SWR Configuration
Adjust based on your content freshness requirements:

```javascript
// Serve stale for 30 seconds while updating
const SWR_WINDOW = 30;

// Enable/disable stale-while-revalidate
const SERVE_STALE_WHILE_REVALIDATE = true;
```

#### Timeout & Retry Settings
Configure based on your origin server performance:

```javascript
// Timeout for origin requests (milliseconds)
const ORIGIN_TIMEOUT = 30000; // 30 seconds

// Maximum retries for failed requests
const MAX_RETRIES = 2;

// Base delay between retries (milliseconds)
const RETRY_DELAY = 1000; // 1 second
```

### 4. WordPress Plugin Integration

#### Export Cookie Configuration
Use the WordPress plugin to generate the cookie configuration:

1. Go to WordPress Admin → Cloudflare Smart Cache
2. Click "Export Cookie Configuration"
3. Copy the JSON array
4. Replace `LOGIN_COOKIE_PREFIXES` in the worker

#### Plugin Headers
The WordPress plugin automatically sends cache control headers:

- `x-HTML-Edge-Cache: purgeall` - Triggers cache purge
- `x-HTML-Edge-Cache: supports=cache|purgeall|bypass-cookies` - Indicates compatibility

### 5. Monitoring & Debugging

#### Response Headers to Monitor
- `x-HTML-Edge-Cache-Status`: Shows cache decision
- `x-HTML-Edge-Cache-Debug`: Detailed debug info
- `x-Edge-Cache-Age`: Cache age in seconds
- `x-Edge-Debug-Cookies`: Cookie analysis
- `x-Edge-Debug-Login-Match`: Matched login cookies

#### Common Status Values
- `Hit`: Served from cache
- `Miss`: Fetched from origin
- `Stale-While-Revalidate`: Stale content served, updating in background
- `Bypass Login Cookie`: Bypassed due to login cookies
- `Bypass URL Pattern`: Bypassed due to URL pattern
- `Bypass Authorization Header`: Bypassed due to auth header
- `Bypass Set-Cookie Response`: Bypassed due to response cookies
- `Bypass Cache-Control`: Bypassed due to cache control headers

### 6. Testing Your Configuration

#### Test Cache Behavior
1. **Anonymous User Test**
   ```bash
   curl -I https://yoursite.com/
   # Should show: x-HTML-Edge-Cache-Status: Hit (after first request)
   ```

2. **Logged-in User Test**
   ```bash
   curl -I -H "Cookie: wordpress_logged_in_abc123=userdata" https://yoursite.com/
   # Should show: x-HTML-Edge-Cache-Status: Bypass Login Cookie
   ```

3. **Admin Area Test**
   ```bash
   curl -I https://yoursite.com/wp-admin/
   # Should show: x-HTML-Edge-Cache-Status: Bypass URL Pattern
   ```

#### Debug Headers
Add debug information to check configuration:

```bash
curl -I https://yoursite.com/test-page
```

Look for these headers:
- `x-HTML-Edge-Cache-Debug`: Shows reason for cache decision
- `x-Edge-Debug-Cookies`: Lists all cookies found
- `x-Edge-Debug-Login-Match`: Shows which cookies matched login patterns

### 7. Security Checklist

- [ ] **Cookie Detection**: Verify all session cookies are detected
- [ ] **URL Patterns**: Ensure all admin/private URLs are bypassed
- [ ] **Response Headers**: Check that Set-Cookie responses aren't cached
- [ ] **Authorization**: Verify requests with Authorization headers bypass cache
- [ ] **Cache-Control**: Confirm private/no-cache responses aren't cached
- [ ] **User Testing**: Test with actual logged-in users

### 8. Performance Optimization

#### Origin Server Configuration
1. **Set Proper Headers**
   ```
   Cache-Control: public, max-age=3600
   ```

2. **Avoid Unnecessary Cookies**
   - Don't set cookies on static content
   - Use separate domains for static assets

3. **Optimize Response Times**
   - Reduce origin response time
   - The worker timeout is 30 seconds

#### Cache Ratio Monitoring
Monitor these metrics in Cloudflare Analytics:
- Cache Hit Rate
- Origin Response Time
- Worker Execution Time
- Error Rate

### 9. Troubleshooting

#### High Bypass Rate
If you see too many cache bypasses:

1. **Check Cookie Patterns**
   - Review `x-Edge-Debug-Cookies` header
   - Adjust `LOGIN_COOKIE_PREFIXES` if needed

2. **Review URL Patterns**
   - Check if legitimate pages are being bypassed
   - Adjust `BYPASS_URL_PATTERNS` if too broad

3. **Origin Headers**
   - Check if origin is sending `Set-Cookie` unnecessarily
   - Verify `Cache-Control` headers are correct

#### Low Cache Hit Rate
If cache hit rate is low:

1. **Check Normalization**
   - Review URL parameter stripping
   - Add more tracking parameters to strip

2. **Verify KV Binding**
   - Ensure `SMART_CACHE` KV namespace is bound
   - Check KV storage usage

3. **Monitor Origin Health**
   - Check if origin is responding with errors
   - Verify origin response times

#### Private Content Cached
If private content gets cached:

1. **Immediate Action**
   - Purge cache via Cloudflare dashboard
   - Add missing cookie pattern to `LOGIN_COOKIE_PREFIXES`

2. **Investigation**
   - Check which cookies the user had
   - Review `x-Edge-Debug-Cookies` header
   - Update cookie detection patterns

3. **Prevention**
   - Add more comprehensive cookie patterns
   - Consider more restrictive caching rules

### 10. Advanced Configuration

#### Custom Headers
Add custom bypass logic:

```javascript
// Add to createForwardRequest function
forwardRequest.headers.set("x-Custom-Cache-Control", "enhanced");
```

#### Geographic Considerations
Configure different behavior by region:

```javascript
// Add country-specific logic
const country = request.cf.country;
if (country === 'US') {
  // US-specific caching rules
}
```

#### A/B Testing Support
Handle A/B testing cookies:

```javascript
// Add A/B testing cookies to bypass list
"ab_test_",
"experiment_",
"variant_",
```

This configuration guide helps ensure optimal security and performance for your Cloudflare Smart Cache implementation.
