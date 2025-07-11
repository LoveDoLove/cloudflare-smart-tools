<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

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

<h3 align="center">Cloudflare Smart Cache</h3>

  <p align="center">
    Powerful all-in-one Cloudflare cache solution for WordPress: edge HTML caching, automatic purging on post/category changes, advanced admin controls, API token support, and comprehensive logging.
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

Cloudflare Smart Cache is a powerful WordPress plugin and Cloudflare Worker solution for advanced edge HTML caching. It provides automatic cache purging on post, category, and comment changes, advanced admin controls, API token support, and comprehensive logging. The included Cloudflare Worker scripts enable fine-grained cache control and bypass logic for logged-in users and common WordPress plugins.

### Features

- Edge HTML caching for WordPress via Cloudflare Workers
- Automatic cache purging on post, category, and comment changes
- Advanced admin controls and settings page in WordPress
- API token and global API key support
- Comprehensive logging and performance metrics
- Customizable cache bypass rules for cookies and URIs
- Easy integration with Cloudflare via Wrangler

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- PHP (WordPress plugin)
- JavaScript (Cloudflare Workers)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [WordPress](https://wordpress.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to set up Cloudflare Smart Cache for your WordPress site.

### Prerequisites

- WordPress 5.0+ (tested up to 6.4)
- PHP 7.4+
- Cloudflare account with API access
- Wrangler CLI for deploying Workers

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-cache.git
   ```
2. Install the WordPress plugin:
   - Copy the `cf-smart-cache` directory into your WordPress `wp-content/plugins/` directory.
   - Activate "Cloudflare Smart Cache" from the WordPress admin plugins page.
3. Configure Cloudflare Worker:
   - Install Wrangler:
     ```sh
     npm install -g wrangler
     ```
   - Edit [`workers/wrangler.toml`](workers/wrangler.toml:1) with your Cloudflare account details:
     ```toml
     CLOUDFLARE_EMAIL = "your-email@example.com"
     CLOUDFLARE_API_KEY = "your-global-api-key"
     CLOUDFLARE_ZONE_ID = "your-zone-id"
     ```
   - Deploy the Worker:
     ```sh
     wrangler publish
     ```
4. (Optional) Customize cache bypass rules in [`cf-cache-rules/rules-v1.regex`](cf-cache-rules/rules-v1.regex:1).
5. Configure plugin settings in the WordPress admin under "Settings > Cloudflare Smart Cache".

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- The plugin will automatically manage cache purging on post, category, and comment changes.
- Use the admin settings page to configure API tokens, bypass cookies, and advanced options.
- The Cloudflare Worker will handle edge HTML caching and respect bypass rules for logged-in users and common plugins.
- Review logs and performance metrics in the plugin admin panel.

_For more examples, see the plugin settings and Worker scripts._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Enhanced cache analytics dashboard
- [ ] Granular cache rules editor in WordPress
- [ ] Multi-site support
- [ ] Additional integrations (WooCommerce, etc.)

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-cache/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please fork the repo and create a pull request, or open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-smart-cache/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-cache" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
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
