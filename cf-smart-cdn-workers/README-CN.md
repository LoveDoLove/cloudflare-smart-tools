## Cloudflare Worker Edge CDN

### 设置

#### 创建KV命名空间

```
创建 KV 命名空间，并在您的 Cloudflare 帐户中将其命名为“EDGE_CDN”。
```

---

#### 创建 Worker

```
我们可以将worker名称设置为edge-cdn

之后，单击“编辑代码”按钮

将以下代码复制到worker.js文件中，并将其粘贴到cloudflare编辑器中显示的“worker.js”文件中。
```

---

### 将worker与KV命名空间绑定

```
变量名称放入 EDGE_CDN （必须遵循您的 kv 命名空间名称）

然后KV命名空间选择刚才我们创建的EDGE_CDN
```

---

### 添加到worker的路由

```
例如，我们可以将 `cdn.example.com/*` 作为路由，并且您必须选择您在 cloudflare 帐户中拥有的域。
```

---

### Cloudflare 優選域名解析服務（SAAS）与 CNAME

```
测试哪个域名对您的网站来说速度最快

完成 CNAME 选择后

在您刚才选择的域中创建 DNS 记录

添加 `cdn.example.com` 作为您的 cname 路由并指向 CNAME SAAS 域
```

[Cloudflare 優選域名解析服務（SAAS）与 CNAME](https://www.baota.me/post-411.html)

---

### 貢獻 / 改進建議

如果您發現任何代碼可以改進的地方，或有新功能的建議，歡迎隨時貢獻！我們歡迎您的 Pull Request 和反饋。您的改進將幫助這個項目變得更好。
