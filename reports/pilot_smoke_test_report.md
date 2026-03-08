# Pilot mode smoke-test report

Date: 2026-03-08

## Scope
Compatibility integration smoke checks for:
- landing page load
- exam start
- question navigation
- flagging/review
- timer persistence
- export
- calculator
- custom pilot response type rendering

## Automated checks run

1. Static syntax check:
- `node --check script.js` ✅

2. Pilot artifact shape checks:
- `node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('content/candidates/phpm_saq_approved_pilot_bank_v1.json','utf8'));const rt=[...new Set(d.questions.flatMap(q=>q.parts.map(p=>p.response_type)))];console.log('q',d.questions.length,'types',rt);console.log('ids',d.questions.map(q=>q.question_id).join(','));"` ✅
- `node - <<'NODE'\nconst fs=require('fs');const d=JSON.parse(fs.readFileSync('content/candidates/phpm_saq_approved_pilot_bank_v1.json','utf8'));let t=0;for(const q of d.questions){for(const p of q.parts)t+=Number(p.max_score)||0;}console.log(t)\nNODE` ✅

3. Browser smoke script (playwright tool):
- landing/exam-start checks were obtained for both legacy and pilot modes.
- environment instability (headless chromium crashes / intermittent visibility timing) prevented fully reliable completion of all UI-path checks in one pass. ⚠️

## Outcome summary

- Landing page load: covered (legacy + pilot).
- Exam start: covered (legacy + pilot).
- Question navigation: partially covered in browser smoke; full deterministic verification pending stable browser run.
- Flagging/review: partially covered in browser smoke; full deterministic verification pending stable browser run.
- Timer persistence: partially covered in browser smoke; full deterministic verification pending stable browser run.
- Export: pending stable browser run for deterministic download assertions.
- Calculator: pending stable browser run for deterministic UI interaction assertions.
- Custom response rendering in pilot bank:
  - adapter maps `short_text` to existing single-line text runtime behavior.
  - pilot response types observed: `list`, `short_text`, `text`.

## Recommendation
Re-run browser smoke locally (or CI runner with stable Chromium) using:
- legacy: `index.html`
- pilot: `index.html?bank=pilot`

and confirm the remaining interactive checks in one clean pass.
