<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/LoveDoLove/cloudflare-smart-tools">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">CF Smart CDN Workers</h3>

  <p align="center">
    Cloudflare Worker for smart CDN proxying and dynamic domain rewriting.
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cdn-workers"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cdn-workers">View Demo</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/LoveDoLove/cloudflare-smart-tools/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cdn-workers)

CF Smart CDN Workers is a Cloudflare Worker script that acts as a smart CDN proxy. It forwards requests to a configurable target domain, rewrites domain references in HTML, CSS, and JavaScript responses, and enables seamless domain replacement for mirrored or proxied sites. This is useful for custom CDN, domain mirroring, or content rewriting scenarios.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [Cloudflare Workers](https://workers.cloudflare.com/)
* JavaScript (ES2020+)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these instructions to deploy and use the CF Smart CDN Worker on your Cloudflare account.

### Prerequisites

- A Cloudflare account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed

```sh
npm install -g wrangler
```

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-tools.git
   cd cloudflare-smart-tools/cf-smart-cdn-workers
   ```
2. Configure your environment variables in `wrangler.toml` (create if missing):

   ```toml
   [vars]
   TARGET_DOMAIN = "example.com"
   REPLACE_DOMAIN = "yoursite.com"
   ```

3. Deploy the worker:
   ```sh
   wrangler publish
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Once deployed, all requests to your Worker endpoint will be proxied to `TARGET_DOMAIN`, and all occurrences of `TARGET_DOMAIN` in HTML, CSS, and JS responses will be replaced with `REPLACE_DOMAIN`.

**Example:**

- Request: `https://your-worker.your-account.workers.dev/path/to/resource`
- Proxies to: `https://example.com/path/to/resource`
- All `example.com` references in the response are rewritten to `yoursite.com`.

_See [`worker.js`](worker.js) for implementation details._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Add support for additional content types
- [ ] Add caching options
- [ ] Add configuration via query parameters or headers
- [ ] Add logging and analytics

See the [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for a full list of proposed features (and known issues).

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

Distributed under the MIT License. See [`LICENSE`](../../LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://twitter.com/LoveDoLove)  
Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cdn-workers](https://github.com/LoveDoLove/cloudflare-smart-tools/tree/main/cf-smart-cdn-workers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

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