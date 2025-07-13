<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-cache">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Smart Cache</h3>

  <p align="center">
    Powerful all-in-one Cloudflare cache solution for WordPress: edge HTML caching, automatic purging, advanced admin controls, API token support, and comprehensive logging.
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

Cloudflare Smart Cache is a powerful WordPress plugin and Cloudflare Worker combo that delivers advanced HTML edge caching for your site. It automatically purges cache on post/category changes, provides robust admin controls, supports API tokens, and logs all cache actions. Designed for performance, security, and easy integration with modern WordPress sites.

- Edge HTML caching via Cloudflare Worker (KV or API)
- Automatic cache purging on content changes
- Admin dashboard controls and logging
- Secure API token support
- Full uninstall cleanup

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* PHP (WordPress Plugin)
* JavaScript (Cloudflare Worker)
* Cloudflare Workers KV/API
* Wrangler (Cloudflare Worker CLI)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to set up Cloudflare Smart Cache for your WordPress site.

### Prerequisites

- WordPress 5.0+ (PHP 7.4+)
- Cloudflare account with API access
- Wrangler CLI for deploying workers

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-cache.git
   ```
2. **Install the WordPress Plugin**
   - Copy the `cf-smart-cache` folder into your WordPress `wp-content/plugins/` directory.
   - Activate "Cloudflare Smart Cache" from the WordPress admin plugins page.

3. **Configure Cloudflare Worker**
   - Install Wrangler:  
     ```sh
     npm install -g wrangler
     ```
   - Set your Cloudflare credentials in `workers/wrangler.toml`:
     ```toml
     [vars]
     CLOUDFLARE_EMAIL = "your-email@example.com"
     CLOUDFLARE_API_KEY = "your-global-api-key"
     CLOUDFLARE_ZONE_ID = "your-zone-id"
     ```
   - (Recommended) Bind a KV namespace named `SMART_CACHE` for optimal HTML cache purging.

4. **Deploy the Worker**
   ```sh
   wrangler publish
   ```

5. **Configure DNS/Routes**
   - Set your Cloudflare Worker route to match your WordPress site domain.

6. **Plugin Settings**
   - Configure plugin options and API tokens in the WordPress admin dashboard.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- The plugin automatically caches HTML at the edge and purges cache on post/category changes.
- Admins can manually purge cache or view logs from the WordPress dashboard.
- The worker bypasses cache for logged-in users, admin paths, and specific cookies.
- For advanced configuration, edit the worker script or plugin settings as needed.

_See the [Documentation](https://github.com/LoveDoLove/cloudflare-smart-cache) for more details._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Granular cache purging by URL/category
- [ ] Enhanced analytics and reporting
- [ ] Multi-site support
- [ ] UI improvements

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-cache/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request, or open an issue for suggestions.

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

LoveDoLove - [@LoveDoLove](https://twitter.com/LoveDoLove)  
Project Link: [https://github.com/LoveDoLove/cloudflare-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Workers](https://workers.cloudflare.com/)
* [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
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
[linkedin-url]: https://linkedin.com/in/lovedolove
[product-screenshot]: images/screenshot.png