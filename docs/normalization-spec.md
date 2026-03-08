# Question Bank Normalization Specification (Offline Migration Plan)

## Scope and constraints
This specification defines an **offline-only** normalization pipeline from the current mixed-era bank into the canonical schema described in `docs/question-schema.md`. It does **not** modify runtime behavior and does not require changes to `script.js`, `index.html`, `style.css`, `question_bank.json`, or `exam_forms.json`.

Inputs:
- `question_bank.json`
- `exam_forms.json`
- `content/taxonomy.json`

Outputs (future migration step, not done now):
- Canonical question objects suitable for safe staged ingestion.
- Migration logs with explicit uncertainty flags.

---

## Proposed canonical normalization pipeline
1. **Ingest and freeze source artifacts**
   - Read `question_bank.json` and `exam_forms.json` as immutable source snapshots.
   - Record source file checksum and generation timestamp for traceability.

2. **Inventory and preflight checks**
   - Verify unique legacy question `id` and part `id` values.
   - Build form-membership index (`question_id -> [form_ids]`).
   - Detect ID collisions by numeric equivalence (e.g., `Q1` vs `Q01`).

3. **Per-question canonical projection**
   - Create `question_id` and `legacy_ids` using deterministic rules below.
   - Lift metadata from question-level and part-level fields into canonical locations.
   - Convert optional media fields to `stem_assets`.

4. **Per-part canonical projection**
   - Map each legacy `parts[]` entry to canonical part object.
   - Normalize response constraints from `response_type`, `list_count`, and known widget flags.
   - Preserve rubric and scoring without semantic reinterpretation.

5. **Taxonomy harmonization pass**
   - Attempt strict mappings from legacy domain / rc / theme to canonical taxonomy.
   - If mapping cannot be proven, set null and attach `migration_flags`.

6. **Risk classification and review bundle**
   - Auto-label objects as low/medium/high migration risk.
   - Emit unresolved decisions as a manual review queue.

7. **Non-destructive output generation**
   - Write canonical candidates and a review report under `reports/`.
   - Do not overwrite live runtime data until exemplar migration is approved.

---

## Exact handling rules

### question_id
- Canonical `question_id` must be generated as a stable, collision-free identifier independent of legacy display style.
- Recommended rule:
  - Parse numeric portion of legacy `id` when available.
  - Emit canonical ID in one normalized format (for example `Q-LEGACY-0001`, `Q-LEGACY-0002`, ...).
  - If numeric parse fails, use a deterministic fallback suffix (`Q-LEGACY-UNPARSEABLE-<hash8>`).
- Canonical `question_id` must not depend on current form membership.

### legacy_ids
- Always preserve raw legacy values:
  - `legacy_ids.id` = original question `id`
  - `legacy_ids.number` = original question `number` (nullable)
- Add optional `legacy_ids.id_numeric` when parseable from `id`.
- Add `legacy_ids.collision_group` if multiple legacy IDs share the same numeric meaning.

### number / display_number
- Keep legacy numeric `number` as provenance only.
- Derive `display_number` for UI from migration policy (not from legacy `id` string formatting).
- If `number` missing, do not infer display sequence automatically without explicit policy.

### stem_assets from fields like stem_image
- If `stem_image` exists:
  - Create a `stem_assets[]` element with `asset_type: image` and `path = stem_image`.
  - Preserve original field in migration trace but not as canonical source-of-truth.
- If no media field exists, emit `stem_assets: []`.

### legacy domain
- Treat numeric `domain` as legacy-only and potentially ambiguous.
- Store raw values in a provenance field (e.g., `legacy_taxonomy.domain_values`).
- Only map to canonical taxonomy via an explicit, approved codebook.
- If no approved mapping exists, keep canonical theme/classification fields null and add review flag.

### rc_classification
- Legacy values may appear at part level only.
- When valid and codebook-supported, map to:
  - `official_written_classification_code`
  - `official_written_classification_label`
- If missing in any part, retain null for that part and flag for taxonomy completion.

### theme
- Legacy `theme` values at part level may map to official topic themes (`A`–`F`) when valid.
- Populate:
  - `official_topic_theme_code`
  - `official_topic_theme_label`
- If absent/invalid, do not infer from domain or stem text automatically.

### part metadata defaults when not yet present
For missing canonical part fields, use explicit defaults plus flags:
- `instruction_verb`: null + `needs_manual_instruction_verb`
- `response_constraints.list_count_required`: from `list_count` for list response; else null
- `response_constraints.single_line`: boolean from legacy `single_line` else `false`
- `response_constraints.matrix_rows` / `matrix_columns`: null unless explicit mapping exists
- `must_have_elements`: from `must_have` else `[]`
- `answer_key`: from `rubric` else `[]`
- `acceptable_alternatives`: `[]`
- `scoring_notes`: null
- `source_list`: [] when no source metadata exists

---

## Safe automatic transformations
- Structural field renaming with no semantic reinterpretation.
- Deterministic ID normalization + retention of original IDs in provenance.
- `max_score` carry-forward as canonical part scoring.
- `rubric` -> `answer_key` carry-forward.
- `must_have` -> `must_have_elements` carry-forward.
- `stem_image` -> `stem_assets[]` conversion.
- Form membership extraction from `exam_forms.json`.

## Do not auto-map without review
- Numeric `domain` -> official taxonomy codes/labels.
- Missing `number` inference from array order.
- Deriving taxonomy from free-text stem/rubric.
- Interpreting nonstandard response widgets (`haddon_matrix`, `two_by_two_workspace`) into canonical constraints without explicit schema extension.
- Adding source provenance text where none exists.

## Manual decisions required before migration
1. **Canonical ID policy** for resolving `Q1` vs `Q01` style collisions.
2. **Approved domain crosswalk** (or decision to retire domain as unmapped legacy metadata).
3. **Treatment of nonstandard response structures** (`haddon_matrix`, `two_by_two_workspace`) in canonical schema.
4. **Source metadata policy** (minimum acceptable provenance for migrated records).
5. **Display numbering policy** when legacy `number` is missing.
6. **Exemplar batch selection policy** (which low-risk items migrate first and what acceptance checks are required).
