# V4 documentation staleness audit

Date: October 24, 2026

## Scope and method

This audit compares operational statements in `docs/` and `reports/` with the
approved PHPM Exam Hub Project Charter, Version 4.0, and the October 2026
checkout. It identifies obvious March-era statements that could be mistaken for
current governance or release guidance. Historical files are not deleted or
rewritten by this audit.

## Findings

### `docs/local_smoke_tests.md`

- **Conflicting or stale statement:** The title still says “Phase A,” the
  isolated `npx` command does not reliably resolve the repository config, and
  the document presents the suite as verifying behaviour even though its
  assertions have drifted from the October runtime.
- **Recommended disposition:** **Update.** Use the supported installed-dependency
  command, current browser prerequisites, and the actual V4 regression contract.
- **Risk if left unchanged:** Future sessions may treat command resolution or a
  stale assertion as an environment problem, or infer that the NRC suite is
  green.

### `docs/pilot_mode.md`

- **Conflicting or stale statement:** The risk log says legacy and pilot modes
  share local-storage keys. The current runtime uses mode-scoped
  `saq_legacy_*` and `saq_pilot_*` keys.
- **Recommended disposition:** **Update.** Correct storage and resume behaviour,
  then clarify how pilot compatibility relates to the V4 written-form roadmap.
- **Risk if left unchanged:** Incorrect recovery or test assumptions could cause
  needless storage changes or missed isolation regressions.

### `docs/normalization-spec.md`

- **Conflicting or stale statement:** It describes canonical outputs as a future
  migration step “not done now,” although candidate bundles, adjudication
  reports, and an approved pilot bank were subsequently generated.
- **Recommended disposition:** **Superseded.** Retain it as the original plan and
  add a pointer to implemented artifacts and remaining decisions.
- **Risk if left unchanged:** A future task could repeat completed migration work
  or apply obsolete assumptions to live banks.

### `reports/phase_a_smoke_test_report.md`

- **Conflicting or stale statement:** It says browser tests were not executed
  because of environment constraints. Browser execution is now possible; the
  suite reaches four application assertions that require V4 triage.
- **Recommended disposition:** **Keep as history.** Mark it as a superseded
  Phase A result and create a dated V4 report after test alignment.
- **Risk if left unchanged:** It can be misread as evidence that browser testing
  is impossible rather than required for release.

### `reports/pilot_smoke_test_report.md`

- **Conflicting or stale statement:** The March 8 report says deterministic
  browser checks remain pending on a stable Chromium runner.
- **Recommended disposition:** **Keep as history.** Supersede it with current,
  reproducible V4 browser results.
- **Risk if left unchanged:** It understates present test capability and does not
  establish NRC readiness.

### `reports/phpm_saq_approved_pilot_bank_summary_v1.md`

- **Conflicting or stale statement:** It says runtime compatibility integration
  “can proceed next” without changing live behaviour. The October checkout
  already exposes opt-in pilot runtime loading.
- **Recommended disposition:** **Keep as history.** Add a supersession note or a
  link from current pilot documentation.
- **Risk if left unchanged:** A future task could duplicate integration or
  misunderstand which bank is reachable by users.

### `reports/phpm_saq_approved_pilot_bank_validation_report_v1.md`

- **Conflicting or stale statement:** It calls the approved pilot artifact
  “non-runtime and separate from live question bank files.” Pilot query mode now
  loads that artifact at runtime.
- **Recommended disposition:** **Keep as history.** Preserve its validation
  evidence but supersede the runtime-status statement.
- **Risk if left unchanged:** Reviewers may exclude a user-reachable bank from
  release, privacy, provenance, or regression review.

### `reports/question-bank-audit.md`

- **Conflicting or stale statement:** The March audit inventories three forms
  and migration risk, but is not a V4 examination-integrity sign-off. It does
  not resolve the charter's score discrepancy concern or cover a 90-minute form.
- **Recommended disposition:** **Superseded.** Keep the historical inventory and
  replace it with a V4 integrity report before form expansion.
- **Risk if left unchanged:** Treating it as current approval could allow scoring
  inconsistencies into the NRC release.

### `reports/question-bank-audit.json`

- **Conflicting or stale statement:** The machine-readable March snapshot has
  the same three-form boundary and cannot represent a completed V4 integrity
  decision or the planned 90-minute form.
- **Recommended disposition:** **Superseded.** Retain it for reproducibility and
  generate a versioned V4 artifact rather than overwriting it.
- **Risk if left unchanged:** Automation may consume an old inventory as current
  release metadata.

## Adjacent finding outside the requested directories

`applied-exam-qa-checklist.md` is still labelled “MVP stabilization” and asks
reviewers to confirm static/local-only constraints. That conflicts with the
approved dynamic-update and hosted-submission work. It was not changed because
this audit was scoped to `docs/` and `reports/`. Stephen should decide whether
to update it in place or supersede it with a V4 NRC release checklist.

## Files not flagged

The remaining versioned taxonomy, gold-standard, and migration-tranche reports
read as dated evidence or data-review artifacts rather than current project-wide
scope instructions. They remain useful history and showed no obvious conflict
requiring a V4 warning during this audit.

## Decisions still needed

1. Choose canonical repository terminology for “Custom GPT,” “plugin,” and
   “assistant,” and decide whether migration of the six existing destinations
   occurs before or after the NRC release.
2. Approve the composition and blueprint balance of the 90-minute form; the
   charter authorizes the format but not a specific question selection.
3. Decide whether the root Applied Exam QA checklist is updated in place or
   retained as history and superseded by a V4 release checklist.
