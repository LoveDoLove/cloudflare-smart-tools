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

<h3 align="center">Cloudflare Smart Cache & Bypass Rules</h3>

  <p align="center">
    Advanced Cloudflare cache management for WordPress and web apps: edge HTML caching, automatic purging, admin controls, API token support, and ready-to-use bypass rules for major frameworks.
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-cache)

Cloudflare Smart Cache is a powerful, modular solution for advanced cache management on Cloudflare, with a focus on WordPress and major web frameworks. It includes:
- A WordPress plugin for edge HTML caching, automatic purging, admin controls, API token support, and logging.
- Ready-to-use Cloudflare cache bypass rules for WordPress, Laravel, ASP.NET, and generic web apps.
- Legacy Cloudflare Worker scripts (deprecated) for reference and migration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [WordPress](https://wordpress.org/)
* [Cloudflare](https://www.cloudflare.com/)
* [PHP](https://www.php.net/)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get started, choose the component that fits your needs:
- **WordPress users:** Install the plugin from `cf-smart-cache/`.
- **Cloudflare users:** Use the ready-to-copy rules in `cf-bypass-cache/`.

### Prerequisites

- WordPress 5.0+ (for plugin)
- PHP 7.4+
- Cloudflare account (for cache rules)

### Installation

#### WordPress Plugin
1. Download or clone this repository.
2. Copy the `cf-smart-cache` folder to your WordPress `wp-content/plugins/` directory.
3. Activate **Cloudflare Smart Cache** from the WordPress admin.
4. Configure your Cloudflare API token and zone ID in the plugin settings.

#### Cloudflare Bypass Rules
1. Open the relevant `.rules.md` file in `cf-bypass-cache/`.
2. Copy the rule block for your framework (WordPress, Laravel, ASP.NET, or all-in-one).
3. Paste it into the Cloudflare expression builder under Rules > Cache Rules.
4. Adjust as needed for your environment.

#### (Deprecated) Cloudflare Workers
- See the `workers/DEPRECATED.md` for migration guidance. Do not use for new development.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- **WordPress:** Enjoy automatic edge HTML caching, purging on post/category changes, and advanced admin controls.
- **Cloudflare Rules:** Instantly bypass cache for authenticated/admin users with copy-paste rules.
- **Legacy Workers:** Reference only; see `workers/DEPRECATED.md`.

_For more examples, see the documentation in each subfolder._

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

LoveDoLove - [@LoveDoLove](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Docs](https://developers.cloudflare.com/)
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
[linkedin-url]: https://linkedin.com/in/
[product-screenshot]: images/logo.png
