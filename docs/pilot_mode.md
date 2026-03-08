# Pilot bank runtime compatibility mode

## Default behavior (legacy mode)
No change is required for existing use. Opening `index.html` normally (including `file://`) continues to use the legacy runtime bank/forms path.

## Pilot mode activation
Pilot mode is **opt-in** and non-default.

Use either query parameter:
- `?bank=pilot`
- `?pilot_bank=1`

Example:
- `http://localhost:4173/index.html?bank=pilot`

## What pilot mode does
- Loads `content/candidates/phpm_saq_approved_pilot_bank_v1.json`.
- Adapts pilot schema fields into the existing runtime question shape.
- Keeps legacy renderer/widgets intact (list/text/single-line behavior preserved).
- Builds a conservative pilot-only full form (`EXAM_180_V1`) using all 15 pilot items.

## Pilot mode form support
- ✅ Full Exam button works (15 adapted pilot questions, 180-minute timer).
- 🚫 Practice/AHD/Half forms are intentionally disabled in pilot mode because the pilot artifact only contains 15 curated items and is not mapped to legacy short-form compositions.

## Rollback
Rollback is immediate:
- Remove pilot query parameter and reload.
- No production JSON files were replaced.
- Legacy embedded/fetched behavior remains unchanged.

## Runtime limitations / risk log
1. **`file://` constraint for pilot mode**: pilot mode needs `fetch()` access to `content/candidates/phpm_saq_approved_pilot_bank_v1.json`; under `file://` this is blocked by browser CORS/security rules, so runtime falls back to legacy defaults.
2. **LocalStorage namespace is shared**: pilot and legacy continue using the same autosave keys. Starting a new exam clears prior keys (existing behavior), but mixed-mode resume across browser tabs is still not isolated.
3. **Pilot form coverage is conservative**: only full exam mode is wired in pilot mode to avoid inventing unsupported short-form mappings.
4. **Pilot domain mapping**: pilot parts without legacy numeric domain values map to official classification code strings; domain display is not shown in runtime UI, so this does not alter UX.
