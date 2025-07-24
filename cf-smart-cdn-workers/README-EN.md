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

### Adding the route to the worker

```
Example we can put `cdn.example.com/*` as the route and u must select the domain that you have in your cloudflare account.
```

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
