# Cloudflare Bypass Cache Rules for WordPress

**Purpose:** Focused exclusively on WordPress core and comment cookies.  
**Last reviewed:** 2025-07-14

---

## Bypass Conditions

- **WordPress Admin Area:**

  ```
  (http.request.uri wildcard r"/wp-admin*")
  ```

- **Authenticated/Logged-in Users:**

  ```
  or (http.cookie wildcard r"wordpress_logged_in*")
  or (http.cookie wildcard r"wordpress_sec*")
  or (http.cookie wildcard r"wp_postpass*")
  or (http.cookie wildcard r"wp-*")
  or (http.cookie wildcard r"wordpress*")
  ```

- **WordPress Comment Authors:**
  ```
  or (http.cookie wildcard r"comment_*")
  ```

---

**Usage:**  
Apply these rules in Cloudflare to bypass cache for WordPress admin, authenticated users, and comment authors, ensuring dynamic content is always served fresh.
