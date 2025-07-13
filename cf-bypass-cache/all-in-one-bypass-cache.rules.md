# All-in-One Cloudflare Bypass Cache Rule (Copy-Paste Friendly)

Copy the entire block below and paste it into the Cloudflare expression builder to bypass cache for authenticated/admin users across WordPress, Laravel, ASP.NET, and common frameworks.

```plaintext
(
  (http.request.uri wildcard "/wp-admin*")
  or (http.request.uri contains "/admin")
  or (http.request.uri contains "/umbraco")
  or (http.cookie contains "wordpress_logged_in")
  or (http.cookie contains "wordpress_sec")
  or (http.cookie contains "wp_postpass")
  or (http.cookie contains "wp-")
  or (http.cookie contains "wordpress")
  or (http.cookie contains "comment_")
  or (http.cookie contains "laravel_session")
  or (http.cookie contains "XSRF-TOKEN")
  or (http.cookie contains "remember_web_")
  or (http.cookie contains "ASP.NET_SessionId")
  or (http.cookie contains ".ASPXAUTH")
  or (http.cookie contains ".AspNetCore.")
  or (http.cookie contains "__RequestVerificationToken")
  or (http.cookie contains "PHPSESSID")
  or (http.cookie contains "session")
  or (http.cookie contains "auth")
  or (http.cookie contains "token")
  or (http.cookie contains "user")
)
```

**Instructions:**

- Paste the above block directly into the Cloudflare expression builder.
- Adjust `contains` or `wildcard` as needed for your specific environment.
- This rule covers the most common authentication and admin patterns for WordPress, Laravel, ASP.NET, and generic web apps.
