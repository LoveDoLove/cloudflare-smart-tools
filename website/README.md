<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-tools">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Smart Tools</h3>

  <p align="center">
    Modular suite for advanced Cloudflare cache management, edge caching, and flexible CDN routing for modern web applications.
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools">View Demo</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#modules">Modules</a></li>
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-tools)

Cloudflare Smart Tools is a modular collection for advanced cache management, edge HTML caching, and flexible CDN routing using Cloudflare. It includes:

- **cf-bypass-cache**: Copy-paste friendly Cloudflare cache bypass rules for WordPress, Laravel, ASP.NET, and generic web apps.
- **cf-smart-cache**: WordPress plugin for edge HTML caching, automatic purging, admin controls, API token support, and logging.
- **cf-smart-cdn-workers**: KV-based Cloudflare Worker for dynamic CDN proxying and routing.
- **cf-smart-cache-workers**: Deprecated legacy worker code (see [`DEPRECATED.md`](cf-smart-cache-workers/DEPRECATED.md:1)).

### Modules

- [`cf-bypass-cache`](cf-bypass-cache/README.md:1): Cloudflare cache bypass rules and documentation.
- [`cf-smart-cache`](cf-smart-cache/README.md:1): WordPress plugin for smart cache management.
- [`cf-smart-cdn-workers`](cf-smart-cdn-workers/README.md:1): CDN proxy worker with KV-based routing.
- [`cf-smart-cache-workers`](cf-smart-cache-workers/DEPRECATED.md:1): Deprecated worker code.

### Built With

* Cloudflare Workers
* Cloudflare KV
* PHP (WordPress)
* JavaScript (ES2020+)
* Markdown Documentation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To use Cloudflare Smart Tools, choose the module(s) that fit your needs:

### Prerequisites

- Cloudflare account
- Access to Cloudflare dashboard and/or Workers/KV
- For WordPress plugin: WordPress 5.0+, PHP 7.4+, Cloudflare API Token

### Installation

#### For Cache Bypass Rules

1. Browse [`cf-bypass-cache`](cf-bypass-cache/README.md:1) for rule sets.
2. Copy rules from `.rules` and `.md` files.
3. Paste into Cloudflare dashboard ("Cache Rules" or "Page Rules").

#### For WordPress Smart Cache Plugin

1. Clone the repo:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-tools.git
   ```
2. Copy `cf-smart-cache` to your WordPress `wp-content/plugins` directory.
3. Activate via WordPress admin.
4. Enter Cloudflare API Token and Zone ID in plugin settings.

#### For CDN Worker

1. Navigate to `cf-smart-cdn-workers`:
   ```sh
   cd cf-smart-cdn-workers
   ```
2. Install Wrangler CLI:
   ```sh
   npm install -g wrangler
   ```
3. Configure `wrangler.toml` with your KV namespace.
4. Deploy:
   ```sh
   wrangler publish
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Use cache bypass rules for dynamic content freshness.
- Manage WordPress cache with smart purging and admin controls.
- Proxy requests and manage CDN routing with KV-based worker.
- See module READMEs for detailed usage and examples.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Modular cache bypass rules
- [x] WordPress edge HTML caching plugin
- [x] KV-based CDN proxy worker
- [x] Documentation for all modules
- [ ] REST API cache management
- [ ] Advanced analytics and logging
- [ ] UI for rule management
- [ ] Community contributions

See [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for feature requests and bugs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Fork the repo and submit a pull request, or open an issue for suggestions.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-tools" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE:1) for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://twitter.com/LoveDoLove)  
Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools](https://github.com/LoveDoLove/cloudflare-smart-tools)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Documentation](https://developers.cloudflare.com/)
* [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [contrib.rocks](https://contrib.rocks)
* Community contributors

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/LoveDoLove/cloudflare-smart-tools.svg?style=for-the-badge
[contributors-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LoveDoLove/cloudflare-smart-tools.svg?style=for-the-badge
[forks-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/network/members
[stars-shield]: https://img.shields.io/github/stars/LoveDoLove/cloudflare-smart-tools.svg?style=for-the-badge
[stars-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/stargazers
[issues-shield]: https://img.shields.io/github/issues/LoveDoLove/cloudflare-smart-tools.svg?style=for-the-badge
[issues-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/issues
[license-shield]: https://img.shields.io/github/license/LoveDoLove/cloudflare-smart-tools.svg?style=for-the-badge
[license-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/
[product-screenshot]: images/logo.png