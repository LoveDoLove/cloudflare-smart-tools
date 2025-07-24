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

<h3 align="center">Cloudflare Smart CDN Workers</h3>

  <p align="center">
    KV-based routing Cloudflare Worker for flexible CDN proxying.
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

[![Product Name Screen Shot][product-screenshot]](https://github.com/LoveDoLove/cloudflare-smart-tools)

Cloudflare Smart CDN Workers is a KV-driven routing solution for Cloudflare Workers. It enables dynamic proxying of requests based on path-to-target mappings stored in the `DOMAIN_ROUTER_KV` namespace. Designed for flexibility, maintainability, and security, it supports error handling and easy rule updates via the Cloudflare dashboard or API.

See [`design.md`](cf-smart-cdn-workers/design.md:1), [`requirements.md`](cf-smart-cdn-workers/requirements.md:1), and [`tasks.md`](cf-smart-cdn-workers/tasks.md:1) for technical details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [Cloudflare Workers](https://workers.cloudflare.com/)
* [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
* JavaScript (ES2020+)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To run this project locally or deploy to Cloudflare, follow these steps.

### Prerequisites

* Cloudflare account
* Access to Workers and KV namespace
* [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/LoveDoLove/cloudflare-smart-tools.git
   ```
2. Navigate to the project directory
   ```sh
   cd cf-smart-cdn-workers
   ```
3. Install Wrangler globally (if not already)
   ```sh
   npm install -g wrangler
   ```
4. Configure your `wrangler.toml` with your KV namespace:
   ```toml
   kv_namespaces = [
     { binding = "DOMAIN_ROUTER_KV", id = "your_kv_namespace_id" }
   ]
   ```
5. Deploy the worker:
   ```sh
   wrangler publish
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

1. Add routing rules to the `DOMAIN_ROUTER_KV` namespace:
   - Key: request path (e.g., `/api/data`)
   - Value: target URL (e.g., `https://external.example.com/api/data`)
2. Send requests to your Cloudflare Worker endpoint. The worker will proxy requests based on KV rules.
3. Error responses:
   - 404: No route configured
   - 400: Malformed target URL
   - 502: Proxy failure

_Refer to [`worker.js`](cf-smart-cdn-workers/worker.js:1) for implementation details._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] KV-based routing logic
- [x] Error handling for missing/malformed KV values
- [x] Proxy fidelity (method, headers, body)
- [x] Documentation and design specs
- [ ] Advanced logging and analytics
- [ ] UI for rule management

See [open issues](https://github.com/LoveDoLove/cloudflare-smart-tools/issues) for feature requests and bugs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request, or open an issue for suggestions.

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

Distributed under the MIT License. See [`LICENSE`](../LICENSE) for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

LoveDoLove - [@LoveDoLove](https://twitter.com/LoveDoLove) - (add your email here)

Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools](https://github.com/LoveDoLove/cloudflare-smart-tools)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [contrib.rocks](https://contrib.rocks)

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