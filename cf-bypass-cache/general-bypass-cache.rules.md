# General Cloudflare Bypass Cache Rules (Copy-Paste Friendly)

Copy the relevant rule block below and paste it into the Cloudflare expression builder.

---

## WordPress

```plaintext
(http.request.uri wildcard "/wp-admin*")
or (http.cookie contains "wordpress_logged_in")
or (http.cookie contains "wordpress_sec")
or (http.cookie contains "wp_postpass")
or (http.cookie contains "wp-")
or (http.cookie contains "wordpress")
or (http.cookie contains "comment_")
```

---

## Laravel

```plaintext
(http.request.uri contains "/admin")
or (http.cookie contains "laravel_session")
or (http.cookie contains "XSRF-TOKEN")
or (http.cookie contains "remember_web_")
```

---

## ASP.NET

```plaintext
(http.request.uri contains "/admin")
or (http.request.uri contains "/umbraco")
or (http.cookie contains "ASP.NET_SessionId")
or (http.cookie contains ".ASPXAUTH")
or (http.cookie contains ".AspNetCore.")
or (http.cookie contains "__RequestVerificationToken")
```

---

## Generic Patterns

```plaintext
(http.cookie contains "PHPSESSID")
or (http.cookie contains "session")
or (http.cookie contains "auth")
or (http.cookie contains "token")
or (http.cookie contains "user")
```

---

> **Tip:** Adjust `contains` or `wildcard` as needed for your Cloudflare environment. Only copy one block at a time for the expression builder.
