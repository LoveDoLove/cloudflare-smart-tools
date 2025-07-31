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
    <strong>Powerful all-in-one Cloudflare cache solution for WordPress</strong><br>
    Edge HTML caching, automatic purging, advanced admin controls, API token support, and comprehensive logging.<br>
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
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#built-with">Built With</a></li>
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-tools)

Cloudflare Smart Cache is a WordPress plugin designed to supercharge your website’s performance and security by leveraging Cloudflare’s edge HTML caching. It provides automatic cache purging on post, category, and comment changes, advanced admin controls, secure API token authentication, and comprehensive logging and analytics. The plugin integrates seamlessly with Cloudflare Workers and is built for reliability, scalability, and ease of use.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- Edge HTML caching with Cloudflare Worker integration
- Automatic cache purging on post, category, comment, and taxonomy changes
- Advanced admin controls and logging
- API token authentication for secure Cloudflare API access
- Batch processing and rate limiting to avoid API limits
- Manual cache controls (purge all, purge homepage)
- Admin toolbar integration for quick cache actions
- Security headers and bypass logic for private/admin pages
- Export bypass cookie prefixes for Worker integration
- Comprehensive logging and cache analytics

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- PHP (WordPress Plugin)
- [Cloudflare API](https://api.cloudflare.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

Follow these steps to set up Cloudflare Smart Cache locally:

### Prerequisites

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Cloudflare account with API Token (recommended) or Global API Key

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-tools.git
   ```
2. Copy the `cf-smart-cache` folder into your WordPress `wp-content/plugins` directory.
3. Activate the plugin from the WordPress admin dashboard.
4. Go to **Settings > CF Smart Cache** and enter your Cloudflare API Token and Zone ID.
5. (Optional) Configure bypass cookie prefixes to match your Cloudflare Worker configuration.
6. Save settings and verify cache status.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Usage

After installation and setup, you can:

- Enjoy automatic cache purging on post, category, comment, and taxonomy changes
- Use manual cache controls via the admin settings page (purge all, purge homepage)
- Access advanced admin toolbar integration for quick cache actions
- Monitor batch purging to avoid API rate limits
- View comprehensive logging and cache analytics
- Benefit from security headers and bypass logic for private/admin pages
- Export bypass cookie prefixes for Worker integration

_Refer to the plugin settings page and inline documentation for more details and advanced configuration._

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Roadmap

- [x] Edge HTML caching with Cloudflare Worker integration
- [x] Automatic cache purging on content changes
- [x] API token authentication
- [x] Advanced admin controls and logging
- [x] Batch processing and rate limiting
- [ ] REST API cache management
- [ ] Enhanced analytics dashboard
- [ ] Multisite support

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for a full list of proposed features and known issues.

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

<a href="https://github.com/LoveDoLove/cloudflare-smart-tools/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LoveDoLove/cloudflare-smart-tools" alt="contrib.rocks image" />
</a>


## License

Distributed under the MIT License. See [`LICENSE`](../LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contact

LoveDoLove - [@LoveDoLove](https://github.com/LoveDoLove)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools](https://github.com/LoveDoLove/cloudflare-smart-tools)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Acknowledgments

* [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
* [Cloudflare API Docs](https://api.cloudflare.com/)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

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