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
    <a href="https://lovedolove.github.io/cloudflare-smart-tools/"><strong>Explore the docs »</strong></a>
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

Cloudflare Smart Tools is a comprehensive collection of modules designed to supercharge your Cloudflare setup with advanced caching strategies, edge optimization, and intelligent CDN routing. Whether you're running a WordPress site, building a modern web application, or managing complex CDN requirements, these tools provide the flexibility and power you need.

### Modules

- **CF Bypass Cache**: Ready-to-use Cloudflare cache bypass rules for WordPress, Laravel, ASP.NET, and generic web apps.  
  [Documentation](website/modules/cf-bypass-cache.md) | [View Rules](cf-bypass-cache/)
- **CF Smart Cache**: WordPress plugin for intelligent edge HTML caching, automatic purging, and advanced admin controls.  
  [Documentation](website/modules/cf-smart-cache.md) | [Download Plugin](cf-smart-cache/)
- **CF Smart CDN Workers**: KV-based Cloudflare Worker for dynamic CDN proxying and routing (deprecated).  
  [Documentation](website/modules/cf-smart-cache-workers.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Cloudflare Rules Language
- PHP (WordPress plugin)
- JavaScript (Cloudflare Workers)
- Markdown Documentation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Cloudflare account (free or paid)
- For WordPress plugin: PHP 7.4+, WordPress 5.0+
- For Workers: Cloudflare Workers subscription (optional KV storage)
- Cloudflare API token or Global API key

### Installation

#### For Cache Bypass Rules

1. Browse the [cache bypass rules](website/modules/cf-bypass-cache.md)
2. Copy the appropriate `.rules` file content from [`cf-bypass-cache/`](cf-bypass-cache/)
3. Paste into your Cloudflare dashboard under Rules → Cache Rules

#### For WordPress Sites

1. Download the [Smart Cache plugin](cf-smart-cache/)
2. Copy the `cf-smart-cache` folder to your WordPress `wp-content/plugins/` directory
3. Activate the plugin in WordPress Admin
4. Configure with your Cloudflare API credentials

#### For Advanced CDN Routing

1. Deploy the [CDN Worker](cf-smart-cache-workers/)
2. Configure KV namespace and routing rules as needed

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Use cache bypass rules to ensure dynamic content is always fresh
- Install the Smart Cache plugin for edge HTML caching and automatic purging on WordPress
- Refer to the [documentation site](https://lovedolove.github.io/cloudflare-smart-tools/) for detailed guides, examples, and advanced configuration

_See [website/README.md](website/README.md) for more usage examples and architecture diagrams._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Modular cache bypass rules
- [x] WordPress edge HTML caching plugin
- [x] KV-based CDN proxy worker
- [x] Comprehensive documentation
- [ ] REST API for cache management
- [ ] Advanced analytics dashboard
- [ ] Visual rule management UI
- [ ] Multi-language support

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request, or open an issue for suggestions and improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [website/modules/cf-bypass-cache.md](website/modules/cf-bypass-cache.md#contribution-guidelines) for rule contribution guidelines.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-tools" alt="contrib.rocks image" />
</a>

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools](https://github.com/LoveDoLove/cloudflare-smart-tools)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Cloudflare](https://cloudflare.com) for their platform
- [WordPress Community](https://wordpress.org)
- [Open Source Contributors](https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

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
[license-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/
[product-screenshot]: images/logo.png
