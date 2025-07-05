<!-- Improved compatibility of back to top link: See: https://github.com/LoveDoLove/cloudflare-smart-cache -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-cache">
    <img src="images/logo.png" alt="Logo" width="120" />
  </a>
  <h3 align="center">Cloudflare Smart Cache</h3>
  <p align="center">
    A powerful, secure, and feature-rich Cloudflare cache management solution for WordPress and custom sites.<br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#usage">View Demo</a>
    ·
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache/issues">Report Bug</a>
    ·
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#faqs">FAQs</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
  </ol>
</details>


## About The Project

Cloudflare Smart Cache is a modern, all-in-one caching solution for WordPress and custom (non-WordPress) sites. It leverages Cloudflare's edge network to cache HTML pages, automatically purges cache on content changes, and provides advanced admin controls for seamless integration and management. The project includes both a WordPress plugin and a Cloudflare Worker for maximum flexibility.


## Features

- **Modern Cloudflare API Authentication**: Supports API Token (recommended) and legacy Global API Key + Email.
- **Automatic Cache Purging**: On post/page changes, comments, menus, taxonomies, and more.
- **Smart Edge Cache Headers**: Context-aware cache control for homepage, posts, archives, and REST API.
- **Advanced Bypass Logic**: Bypass for logged-in users, admin, and customizable cookie patterns.
- **Batch Processing & Rate Limiting**: Efficient bulk purging (30 URLs per batch), with Cloudflare API rate limit management.
- **Admin Toolbar Integration**: Quick cache actions from any page in WordPress.
- **Comprehensive Logging**: Multi-level debug logging, error handling, and API usage monitoring.
- **Developer Hooks**: Filters and actions for extensibility and custom workflows.
- **Security Best Practices**: Input sanitization, CSRF protection, secure credential storage, and security headers.
- **Performance Optimizations**: Transient caching, background processing, and minimal resource usage.
- **Compatibility**: WordPress 5.0+, PHP 7.4+, multisite, custom post types, major e-commerce plugins.


## Getting Started

### Prerequisites

- Cloudflare account with API access
- For WordPress: WordPress 5.0 or later
- For Worker: Access to Cloudflare Workers
- PHP 7.4+ (for WordPress plugin)

## Installation

### WordPress Plugin
1. Upload the contents of `plugins/` to your WordPress `wp-content/plugins/cf-smart-cache/` directory.
2. Activate **Cloudflare Smart Cache** from the WordPress admin Plugins page.
3. Go to **Settings > CF Smart Cache** and enter your Cloudflare API credentials and select your zone.

### Cloudflare Worker (Non-WordPress)
1. Copy `workers/cf-smart-cache-html.js` to your Cloudflare Worker environment.
2. Configure the Worker with your Cloudflare API credentials and zone ID as described in the script comments.
3. Deploy the Worker via the Cloudflare dashboard.

## Configuration

### Recommended: API Token (WordPress)
1. In your [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens), create a new API Token with:
   - `Zone:Read` and `Cache Purge:Edit` permissions
   - Restrict to your site's zone
2. Enter the token in the plugin settings.

### Legacy: Global API Key
1. Get your Global API Key from [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Enter your Cloudflare email and API Key in the plugin settings.

### Zone Selection
After configuring authentication, select your domain's zone from the dropdown in the plugin settings.


## Usage

### WordPress
- The plugin automatically adds edge cache headers to public pages and purges cache on content changes (posts, comments, categories, menus, etc.).
- Logged-in users and admin areas are always bypassed for safety.
- Use the admin settings page to manage API credentials and zone selection.
- Use the admin toolbar for quick cache actions (purge current page, purge all cache).

### Cloudflare Worker
- The Worker script caches public HTML pages at the edge, bypasses cache for requests with session/auth cookies, and supports manual/automatic purging.
- Customize bypass logic and cache rules in `cf-smart-cache-html.js` as needed.
## Developer Hooks

### Filters
```php
// Modify supported post types
add_filter('cf_smart_cache_supported_post_types', function($types) {
    $types[] = 'my_custom_post_type';
    return $types;
});

// Customize bypass cookies
add_filter('cf_smart_cache_bypass_cookies', function($cookies) {
    $cookies[] = 'my_custom_cookie';
    return $cookies;
});

// Modify URLs to purge for a post
add_filter('cf_smart_cache_post_purge_urls', function($urls, $post_id, $post) {
    // Add custom URLs
    return $urls;
}, 10, 3);
```

### Actions
```php
// Before cache purge
do_action('cf_smart_cache_before_purge', $urls);

// After cache purge
do_action('cf_smart_cache_after_purge', $urls, $response);
```


## Roadmap

- [ ] Custom cache rules via admin UI
- [ ] Enhanced logging and analytics
- [ ] Multi-site and multi-zone support
- [ ] CLI tools for cache management

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-cache/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please open an issue for major changes or feature requests before starting work.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [GitHub](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Cloudflare](https://www.cloudflare.com/)
- [WordPress](https://wordpress.org/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## FAQs

### Why is my cache not purging?
Ensure that your API Token has the correct permissions (Zone:Cache Purge) and that the plugin settings are configured correctly.

### Does this plugin work with multisite WordPress installations?
Yes, the plugin supports multisite installations. Each site can configure its own Cloudflare settings.

### Can I use this plugin without a Cloudflare account?
No, a Cloudflare account is required to use this plugin.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Troubleshooting

### Common Issues

1. **API Authentication Errors**:
   - Verify that the API Token is valid and has the required permissions.
   - Check the plugin settings for any misconfigurations.

2. **Cache Not Updating**:
   - Ensure that the plugin is active and properly configured.
   - Check the WordPress logs for any errors related to the plugin.

3. **Plugin Conflicts**:
   - Deactivate other caching plugins to avoid conflicts.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/LoveDoLove/cloudflare-smart-cache.svg?style=for-the-badge
[contributors-url]: https://github.com/LoveDoLove/cloudflare-smart-cache/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LoveDoLove/cloudflare-smart-cache.svg?style=for-the-badge
[forks-url]: https://github.com/LoveDoLove/cloudflare-smart-cache/network/members
[stars-shield]: https://img.shields.io/github/stars/LoveDoLove/cloudflare-smart-cache.svg?style=for-the-badge
[stars-url]: https://github.com/LoveDoLove/cloudflare-smart-cache/stargazers
[issues-shield]: https://img.shields.io/github/issues/LoveDoLove/cloudflare-smart-cache.svg?style=for-the-badge
[issues-url]: https://github.com/LoveDoLove/cloudflare-smart-cache/issues
[license-shield]: https://img.shields.io/github/license/LoveDoLove/cloudflare-smart-cache.svg?style=for-the-badge
[license-url]: https://github.com/LoveDoLove/cloudflare-smart-cache/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
