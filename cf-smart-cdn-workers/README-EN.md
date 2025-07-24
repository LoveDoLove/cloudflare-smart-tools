## Cloudflare Worker Edge CDN

### Setup

#### Create KV Namespace

```
Create the KV Namespace with naming it as `EDGE_CDN` in your Cloudflare Account.
```

---

#### Create Worker

```
Worker name we can put as edge-cdn

After that, click on the `edit code` button

Copy the following code in the worker.js file and paste it in the `worker.js` file that show in the cloudflare worker editor.
```

---

### Binding worker with KV Namespace

```
Variable Name Put EDGE_CDN (Must follow your kv namespace name)

Then KV namespace select the EDGE_CDN just now we created
```

---


---

### KV-Based Routing to External Domains (Simple User Guide)

You can now route requests from your Cloudflare domain to any external domain (even if it is not managed by Cloudflare) using KV storage for configuration.

#### Steps:

1. **Create a KV Namespace**
   - Name it `DOMAIN_ROUTER_KV` in your Cloudflare account.
   - Bind it to your Worker as `DOMAIN_ROUTER_KV`.

2. **Configure Routing Rules in KV**
   - Each key should be the request path (e.g., `/api/data`).
   - Each value should be the full target URL (e.g., `https://external.example.com/api/data`).
   - You can add/update these via the Cloudflare dashboard or API—no code changes required.

3. **How It Works**
   - When a request is received, the Worker looks up the path in `DOMAIN_ROUTER_KV`.
   - If a match is found, the request is proxied to the target URL.
   - If no match is found, a clear error message is returned.

#### Example KV Entry

| Key         | Value                                      |
|-------------|--------------------------------------------|
| `/api/data` | `https://external.example.com/api/data`     |

#### Error Handling
If a route is not configured or the target is unreachable, the Worker will return a helpful error message.

---

---

### Cloudflare preferred domain name resolution service (SAAS) and CNAME

```
Test which domain are fast for your website

After done selection for the CNAME

Create the DNS record in ur domain that you select just now

Add the `cdn.example.com` as your cname route and point to the CNAME SAAS domain
```

[Cloudflare preferred domain name resolution service (SAAS) and CNAME](https://www.baota.me/post-411.html)

---

### Contributing / Improvement Suggestions

If you find any areas where the code could be improved or if you have suggestions for new features, feel free to contribute! We welcome pull requests and feedback. Your improvements can help make the project better for everyone.
