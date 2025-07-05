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
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Smart Cache</h3>

  <p align="center">
    Powerful all-in-one Cloudflare cache solution: edge HTML caching, automatic purging on content changes, and advanced admin controls for WordPress and beyond.
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache">View Demo</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-cache/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
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
  </ol>
</details>

## About The Project

Cloudflare Smart Cache is a powerful, all-in-one caching solution designed for both WordPress and non-WordPress sites. It leverages Cloudflare's edge network to cache HTML pages, automatically purges cache on content changes, and provides advanced admin controls for seamless integration and management.

- **WordPress Plugin:** Installs as a standard plugin, adds edge cache headers, and purges cache on post, comment, and theme changes.
- **Cloudflare Worker:** For non-WordPress or custom sites, deploy the provided Worker script to enable smart HTML edge caching and bypass logic.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features

- Edge HTML caching for public pages (WordPress & non-WordPress)
- Automatic cache purging on post, category, comment, and theme changes
- Smart bypass for logged-in users, admin areas, and session cookies
- Admin settings page for Cloudflare API credentials and zone selection
- Works with Cloudflare KV or direct API calls
- Secure, modular, and easy to configure

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- A Cloudflare account with API access
- (For WordPress) WordPress 5.0 or later
- (Optional) Access to Cloudflare Workers for non-WordPress deployment

### Installation

#### WordPress Plugin
1. Download or clone this repository:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-cache.git
   ```
2. Copy `cf-smart-cache.php` to your WordPress `wp-content/plugins/` directory.
3. Activate **Cloudflare Smart Cache** from the WordPress admin Plugins page.
4. Go to **Settings > CF Smart Cache** and enter your Cloudflare API credentials and select your zone.

#### Cloudflare Worker (Non-WordPress)
1. Copy `cf-smart-cache.js` to your Cloudflare Worker environment.
2. Configure the `CLOUDFLARE_API` object with your email, API key, and zone ID.
3. Deploy the Worker via the Cloudflare dashboard.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### WordPress
- The plugin automatically adds edge cache headers to public pages and purges cache on content changes (posts, comments, categories, menus, etc.).
- Logged-in users and admin areas are always bypassed for safety.
- Use the admin settings page to manage API credentials and zone selection.

### Non-WordPress (Cloudflare Worker)
- The Worker script caches public HTML pages at the edge, bypasses cache for requests with session/auth cookies, and supports manual/automatic purging.
- Customize bypass logic and cache rules in `cf-smart-cache.js` as needed.

_For more details, see inline documentation in the source files._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Add support for custom cache rules via admin UI
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
