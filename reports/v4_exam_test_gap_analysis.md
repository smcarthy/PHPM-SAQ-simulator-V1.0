# V4 Written SAQ test-gap analysis

Generated: 2026-10-24T15:53:28.198Z

## Current automated coverage

- **validate_bank.js:** Checks exact bank question IDs, globally unique part
  IDs, positive max_score values, non-empty rubrics, list_count validity, and a
  prompt versus list-count heuristic.
- **tests/smoke.spec.js:** Exercises page loading, Full Exam start, navigation,
  flagging, reload, calculator, review, download, and legacy/pilot storage
  namespaces.
- **Browser baseline:** The current suite reaches application assertions but
  all four tests fail on stale selectors, typography, or automatic-resume
  assumptions.

## High-priority gaps

- No existing validator joins exam_forms.json to question_bank.json.
- No existing test compares declared total_points with summed part max_score.
- No automated test starts or verifies EXAM_AHD_15 or EXAM_30.
- No test asserts exact form membership, question count, part count, or
  duration for any default form.
- No test detects Q1/Q01-style normalized-ID collisions.
- No test verifies embedded fallback data remain identical to external JSON.
- No test verifies that each response type in an active form has a renderer and
  save/restore path.
- The browser flow expects automatic exam display after reload, while the
  runtime intentionally requires the Resume Saved Exam action. This stops the
  flow before calculator, review, and export assertions complete.

## Medium-priority gaps

- Export tests check mode and that questions is an array, but not exact IDs,
  exam_form_id, duration, part max scores, rubrics, or calculated totals.
- No test reconciles the points displayed from declared form metadata with the
  scoring denominator computed from parts.
- No test audits form notices against actual overlap or reuse.
- No test validates canonical traceability, taxonomy code validity, coverage,
  or candidate-versus-live score agreement.
- No test records that nine migrated pilot questions retain
  needs_full_source_review provenance.
- No browser test reaches Q04 haddon_matrix or Q28 two_by_two_workspace and
  verifies answer persistence and export.
- No test exercises malformed or missing form IDs, duplicate form references,
  invalid durations, or invalid max_score values as negative cases.

## Recommended automated test layers

- Run scripts/audit_exam_integrity.js in CI and require exit zero before a
  release; preserve its JSON report as review evidence.
- Add fixture-based unit tests for missing references, duplicate references,
  point mismatches, invalid max_score, ID collisions, and unsupported response
  types.
- Add data-mode-aware browser tests for 15-, 30-, and 180-minute form start,
  exact membership, timer, displayed points, explicit resume, review, and
  export payload.
- Add targeted interaction tests for list, text, haddon_matrix, and
  two_by_two_workspace rendering and persistence.
- Add a parity test for embedded fallback objects versus question_bank.json and
  exam_forms.json.
- Add taxonomy coverage tests only after Stephen approves the authoritative
  metadata source and missing assignments; do not make inferred labels pass.

## Current audit-script result

- **Expected exit:** Non-zero because all three default forms have hard total
  mismatches.
- **Pilot result:** PASS_WITH_WARNINGS; totals reconcile, with provenance and
  provisional-taxonomy warnings.
