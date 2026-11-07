# PHPM Practice MCP service

This stateless HTTPS service exposes two read-only tools for the **PHPM
Leadership Practice** plugin:

- `configure_practice_session` validates and normalizes a requested practice
  format; and
- `get_phpm_resource_links` returns verified project, support, legal, and
  Royal College examination-format links.

The service does not generate educational questions, score responses, accept
file uploads, use authentication, or store tool inputs. The plugin skill holds
the educational instructions and reference material.

## Endpoints

- `POST /mcp` — stateless MCP JSON-RPC endpoint
- `GET /health` — deployment health check

## Local verification

```sh
npm test
npm start
```

The server uses `PORT` when provided and otherwise listens on port 3000.

## Render deployment

The repository-root `render.yaml` defines the service. Deploy the repository as
a Render Blueprint, then use the exact public endpoint ending in `/mcp` in the
plugin's `.mcp.json`. Do not place secrets in the plugin ZIP or repository; the
current service requires none.
