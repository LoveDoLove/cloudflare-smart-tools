<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

> **🚨 CRITICAL UPDATE v3.0:** Fixed cache poisoning where logged-in users see anonymous content! Deployed user-aware cache keys and proper Vary headers. Update to [cf-smart-cache-html-v3.js](workers/cf-smart-cache-html-v3.js) immediately. See [Urgent Fix Guide](URGENT_FIX_v3.0.md).

> **🔧 v2.2 RESOLVED:** Fixed 419 Page Expired errors on non-WordPress sites! If you're experiencing issues with Laravel, Django, or other frameworks, update to [cf-smart-cache-html-v2.js](workers/cf-smart-cache-html-v2.js) immediately. See [Quick Fix Guide](QUICK_FIX_419.md) for details.

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-cache">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Smart Cache for WordPress</h3>

  <p align="center">
    Advanced WordPress plugin for intelligent Cloudflare cache management, featuring smart purging, custom rules, and seamless Cloudflare Worker integration.
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
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Cloudflare Smart Cache for WordPress is a plugin designed to optimize and automate cache management for WordPress sites using Cloudflare. It provides advanced cache purging, custom rule support, and integrates with Cloudflare Workers for edge-side logic, ensuring your content is always fresh and your site remains fast.

**Key Features:**
- Smart, automatic cache purging on content updates, deletions, and status changes.
- Customizable cache rules via regex patterns.
- Cloudflare Worker scripts for advanced edge caching and request handling.
- Admin dashboard for cache status, manual purging, and settings.
- Secure integration with Cloudflare API (token or key).
- Logging and performance metrics.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* PHP (WordPress Plugin)
* JavaScript (Cloudflare Workers)
* Cloudflare API

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to set up Cloudflare Smart Cache for your WordPress site.

### Prerequisites

- WordPress 5.0+
- PHP 7.4+
- Cloudflare account with API access
- Node.js & Wrangler (for deploying Cloudflare Workers, optional)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-cache.git
   ```
2. Copy the `cf-smart-cache` directory into your WordPress `wp-content/plugins/` folder.
3. Activate the plugin from the WordPress admin dashboard.
4. Configure your Cloudflare API credentials and zone in the plugin settings.
5. (Optional) Deploy the worker scripts in `workers/` to your Cloudflare account using Wrangler:
   ```sh
   cd workers
   wrangler publish
   ```
6. (Optional) Customize cache rules in `cf-cache-rules/rules-v1.regex`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Access the plugin settings via the WordPress admin menu.
- View cache status, purge cache manually, or configure automatic purging.
- Adjust cache rules and worker settings as needed.
- Monitor logs and performance metrics from the admin dashboard.

_See the [Documentation](https://github.com/LoveDoLove/cloudflare-smart-cache) for more details and advanced configuration._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Enhanced UI for cache analytics
- [ ] More granular cache rule management
- [ ] Multi-site support
- [ ] Integration with additional CDN providers

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-cache/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-smart-cache/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-cache" alt="contrib.rocks image" />
</a>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare](https://cloudflare.com)
* [WordPress](https://wordpress.org)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

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