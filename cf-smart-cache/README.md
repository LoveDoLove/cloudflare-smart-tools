<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-tools">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudflare Smart Cache</h3>

  <p align="center">
    Powerful all-in-one Cloudflare cache solution for WordPress: edge HTML caching, automatic purging on post/category changes, advanced admin controls, API token support, and comprehensive logging.
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cache"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cache">View Demo</a>
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
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#uninstalling">Uninstalling</a></li>
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

Cloudflare Smart Cache is a WordPress plugin that provides advanced edge HTML caching via Cloudflare, with automatic cache purging on post, category, and comment changes. It offers robust admin controls, API token support, and detailed logging for easy debugging and monitoring.

### Features

- Edge HTML caching for public pages
- Automatic cache purging on post/category/comment changes
- Advanced admin settings page
- API token and zone ID support
- Comprehensive logging (WP_DEBUG compatible)
- Security headers following Cloudflare best practices
- Internationalization support
- Easy uninstall and cleanup

### Built With

- PHP (WordPress plugin)
- Cloudflare API

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Cloudflare account and API token

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-tools.git
   ```
2. Copy the `cf-smart-cache` directory into your WordPress `wp-content/plugins` folder.
3. Activate the plugin via the WordPress admin dashboard.
4. Go to **Settings > CF Smart Cache** and enter your Cloudflare API token and Zone ID.
5. Configure additional options as needed.

### Uninstalling

To completely remove the plugin and all its data:

- Deactivate and delete the plugin from the WordPress admin.
- The uninstall script will clean up all plugin options, transients, and logs from the database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Once activated, the plugin will automatically manage Cloudflare edge caching and purge cache on relevant WordPress events.
- Use the admin settings page to configure API credentials and zone selection.
- Check logs via WP_DEBUG for troubleshooting.

_For more details, see the [Documentation](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cache)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Improved UI for admin settings
- [ ] Support for multiple Cloudflare zones
- [ ] Enhanced logging and analytics
- [ ] Integration with WooCommerce and other plugins

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for a full list of proposed features and known issues.

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

<a href="https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-tools" alt="contrib.rocks image" />
</a>

## License

Distributed under the MIT License. See [`LICENSE`](../LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cache](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Cloudflare](https://www.cloudflare.com/)
- [WordPress](https://wordpress.org/)
- [Best README Template](https://github.com/othneildrew/Best-README-Template)

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
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
