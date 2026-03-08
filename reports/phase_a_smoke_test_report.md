# Phase A smoke report (legacy + pilot)

## Scope
Deterministic browser smoke coverage for:
- load (legacy + pilot)
- exam start
- next/back navigation
- flagging
- review screen
- timer persistence
- export
- calculator interaction
- storage namespace isolation

## Result summary
- Legacy mode: **Not executed in this container** (environmental npm/playwright constraints).
- Pilot mode: **Not executed in this container** (environmental npm/playwright constraints).
- Storage namespacing implementation: **Implemented in `script.js`**.

## Residual risks
1. Browser-engine-specific behavior can still differ across local environments until smoke suite is run on target machine.
2. Pilot-mode fetch of approved pilot bank still depends on HTTP context (expected for pilot mode).
3. Smoke suite validates top-level flow only; it does not exhaustively validate scoring edge cases.

## Local run command
```bash
npx -y @playwright/test@1.52.0 test tests/smoke.spec.js --config=playwright.config.js
```
