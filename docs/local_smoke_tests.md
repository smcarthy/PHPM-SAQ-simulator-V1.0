# Local deterministic smoke tests (Phase A)

This repository now includes a deterministic browser smoke suite covering both legacy and pilot modes.

## One-command run

```bash
npx -y @playwright/test@1.52.0 test tests/smoke.spec.js --config=playwright.config.js
```

This command will:
- start a local HTTP server (`python3 -m http.server 4173` via Playwright `webServer`)
- run smoke checks for legacy mode and pilot mode
- write a machine-readable report to `reports/smoke-playwright-report.json`

## Smoke coverage

The smoke suite verifies:
- legacy mode load
- pilot mode load
- full exam start
- next/back navigation
- flagging
- review screen access
- timer persistence across reload
- export/download generation and payload mode
- calculator interaction
- localStorage namespace isolation (`saq_legacy_*` vs `saq_pilot_*`)

## Notes / limitations

- The suite uses Playwright and requires Chromium availability in the local environment.
- If your environment blocks npm registry access, install dependencies in a network-enabled environment first.
- This is a smoke suite (regression guard), not full scoring correctness validation.
