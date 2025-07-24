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

<h3 align="center">Cloudflare Bypass Cache Rules</h3>

  <p align="center">
    Copy-paste friendly Cloudflare cache bypass rules for WordPress, Laravel, ASP.NET, and generic web apps.
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-bypass-cache"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-bypass-cache">View Demo</a>
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-bypass-cache)

This project provides a collection of ready-to-use Cloudflare cache bypass rules for popular web frameworks. These rules help ensure dynamic content (such as admin areas, authenticated users, and comment authors) is always served fresh, bypassing Cloudflare's cache when necessary.

Rule sets are available for:
- WordPress
- Laravel
- ASP.NET
- Generic web apps

Each rule is documented and copy-paste friendly for Cloudflare's expression builder.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* Cloudflare Rules Language
* Markdown Documentation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

No installation required. Simply copy the desired rule set from the documentation and paste it into your Cloudflare dashboard.

### Prerequisites

- Cloudflare account
- Access to the Cloudflare dashboard for your domain

### Installation

1. Browse the rule sets in this directory:
   - [`all-in-one-bypass-cache.rules`](cf-bypass-cache/all-in-one-bypass-cache.rules:1)
   - [`general-bypass-cache.rules`](cf-bypass-cache/general-bypass-cache.rules:1)
   - [`wordpress.rules`](cf-bypass-cache/wordpress.rules:1)
2. Open the corresponding `.md` file for instructions and copy-paste blocks.
3. Paste the rule into the Cloudflare expression builder under "Cache Rules" or "Page Rules".
4. Adjust `contains` or `wildcard` as needed for your environment.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Select the rule set matching your web application.
- Follow the instructions in the `.md` documentation files:
  - [`all-in-one-bypass-cache.rules.md`](cf-bypass-cache/all-in-one-bypass-cache.rules.md:1)
  - [`general-bypass-cache.rules.md`](cf-bypass-cache/general-bypass-cache.rules.md:1)
  - [`wordpress.rules.md`](cf-bypass-cache/wordpress.rules.md:1)
- Copy the rule block and paste it into Cloudflare's expression builder.
- Save and deploy the rule.

_See documentation files for examples and details._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] All-in-one bypass cache rule for multiple frameworks
- [x] General bypass cache rules
- [x] WordPress-specific rules
- [ ] Add more framework-specific rules (e.g., Drupal, Magento)
- [ ] Add advanced usage examples
- [ ] Community contributions

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request, or open an issue for suggestions and improvements.

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

Distributed under the MIT License. See [`LICENSE`](../../LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://twitter.com/LoveDoLove)  
Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-bypass-cache](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-bypass-cache)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Documentation](https://developers.cloudflare.com/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
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
[license-url]: https://github.com/LoveDoLove/cloudflare-smart-tools/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/
[product-screenshot]: images/logo.png