# Changelog

## 2026-02-28

- Enabled dual-exam landing workflow so **Start Practice Block (0:30)** launches the legacy `EXAM_30` form and **Start Full Exam (3:00)** launches `EXAM_180_V1`.
- Added robust static-data loading priority:
  - hosted mode tries `./question_bank.json` + `./exam_forms.json`
  - `file://` mode uses embedded defaults immediately
  - hosted fetch failures now fall back to embedded defaults with a visible warning banner.
- Unified bank/form routing logic through `exam_forms.json` to avoid ID collisions and ensure form-specific question selection.
- Updated exports so attempt JSON/scored JSON include stems, rubrics, and part metadata (`rc_classification`, `theme`) for downstream grading workflows.
- Rebuilt `question_bank.json` as a combined bank containing both legacy `Q1–Q7` and full-exam `Q01–Q29` questions.
- Updated `exam_forms.json` to define required forms (`EXAM_30`, `EXAM_180_V1`) with fixed ordering and durations.
- Updated `validate_bank.js` to validate the canonical `question_bank.json` file instead of parsing embedded JS literals.
- Removed `Sources (brief)...` lines from the exam UI display while retaining all stems in source data.
- Updated Q04 Haddon matrix orientation so rows are `pre-event`, `event`, `post-event` and columns are host/agent/environment.
- Reinforced Q11 table rendering by referencing `./Q11table.png` in both hosted and embedded banks.
- Revised Q25/Q28 stems and Q28(d) wording per exam-fidelity edits; added a dedicated 2×2 workspace layout for Q28(a) with side-by-side grid + calculation area.
- Fixed question ordering to a single deterministic shuffled sequence for `EXAM_180_V1` (29 questions) and `EXAM_30` (7 questions), preventing per-attempt reshuffling.
