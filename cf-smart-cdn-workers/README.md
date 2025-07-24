<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="./images/logo.png" alt="Logo" width="80" height="80">
</div>

# Cloudflare Smart CDN Workers

Cloudflare Smart CDN Workers is a specification-driven, production-ready Cloudflare Worker solution for dynamic routing and proxying requests from your Cloudflare domain to any external domain, even if it is not managed by Cloudflare. Configuration is simple and user-friendly, leveraging Cloudflare KV storage for flexible, code-free routing rules.

---

## Table of Contents
1. [About The Project](#about-the-project)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Error Handling](#error-handling)
7. [Roadmap](#roadmap)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)
11. [Acknowledgments](#acknowledgments)

---

## About The Project

Cloudflare Smart CDN Workers enables seamless routing from your Cloudflare domain to any external domain using KV storage. It is designed for simplicity, maintainability, and extensibility, following best practices and a specification-driven workflow.

---

## Features
- Route requests from Cloudflare domains to any external domain (not managed by Cloudflare)
- Simple, code-free configuration via Cloudflare KV (`DOMAIN_ROUTER_KV`)
- Robust error handling and clear user feedback
- Proxy fidelity: forwards method, headers, and body
- Fast, scalable, and production-ready
- Fully documented and specification-driven

---

## Architecture
- Cloudflare Worker receives requests on your domain
- Worker extracts the request path and looks up the target URL in the `DOMAIN_ROUTER_KV` namespace
- If a target is found, proxies the request to the external domain, preserving method, headers, and body
- If not found, returns a clear error message

---

## Getting Started

### Prerequisites
- Cloudflare account
- Access to Cloudflare Workers and KV

### Installation & Setup
1. **Create a KV Namespace**
   - Name it `DOMAIN_ROUTER_KV` in your Cloudflare account
   - Bind it to your Worker as `DOMAIN_ROUTER_KV`
2. **Deploy the Worker**
   - Upload `worker.js` to your Cloudflare Worker
   - Bind the KV namespace in your Worker settings
3. **Configure Routing Rules in KV**
   - Each key: request path (e.g., `/api/data`)
   - Each value: full target URL (e.g., `https://external.example.com/api/data`)
   - Add/update via Cloudflare dashboard or API—no code changes required

---

## Usage

When a request is received, the Worker looks up the path in `DOMAIN_ROUTER_KV`. If a match is found, the request is proxied to the target URL. If no match is found, a clear error message is returned.

#### Example KV Entry
| Key         | Value                                      |
|-------------|--------------------------------------------|
| `/api/data` | `https://external.example.com/api/data`     |

---

## Error Handling
- **KV key missing**: Returns 404 error message
- **Target domain unreachable**: Returns 502 error message
- **Malformed KV value**: Returns 400 error message
- **Valid routing**: Returns proxied response

---

## Roadmap
- [x] Dynamic routing via KV
- [x] Proxy fidelity (method, headers, body)
- [x] Robust error handling
- [x] Specification-driven documentation
- [ ] Advanced pattern matching (wildcards, regex)
- [ ] Analytics and logging
- [ ] UI for rule management

See the [open issues](../../issues) for a full list of proposed features and known issues.

---

## Contributing
Contributions are welcome! Please fork the repo and create a pull request, or open an issue with suggestions. All improvements and feedback help make the project better for everyone.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact
Author: LoveDoLove
Project Link: [https://github.com/LoveDoLove/cloudflare-smart-tools](https://github.com/LoveDoLove/cloudflare-smart-tools)

---

## Acknowledgments
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Best README Template](https://github.com/othneildrew/Best-README-Template)
