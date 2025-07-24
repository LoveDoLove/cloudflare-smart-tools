# Design - KV-Based Routing Worker (Spec-Driven Workflow v1)

## Architecture Overview
- Cloudflare Worker receives requests on a Cloudflare domain.
- Worker extracts the request path and looks up the target URL in the `ROUTES_KV` namespace.
- If a target is found, the Worker proxies the request to the external domain, preserving method, headers, and body.
- If not found, returns a clear error message.

## Data Flow
1. [Request] → [Worker] → [KV Lookup: path] → [Proxy to target] → [Response]

## Interfaces
- **KV Namespace**: `ROUTES_KV`
  - Key: request path (e.g., `/api/data`)
  - Value: target URL (e.g., `https://external.example.com/api/data`)
- **Worker API**: Standard Cloudflare Worker fetch event.

## Data Models
- Simple string mapping in KV: path → target URL.

## Error Handling Matrix
| Case                        | Expected Response                |
|-----------------------------|----------------------------------|
| KV key missing              | 404 error message                |
| Target domain unreachable   | 502 error message                |
| Malformed KV value          | 400 error message                |
| Valid routing               | Proxy response                   |

## Unit Testing Strategy
- Test valid routing.
- Test missing KV key.
- Test unreachable target.
- Test malformed KV value.

## Maintainability & Security
- Code is concise, readable, and well-commented.
- No sensitive data stored in KV.
- Error messages do not leak internal details.

## Traceability
- Linked to requirements in `requirements.md` and implementation in `worker.js`.
