# Legacy-to-Canonical Field Mapping (Conservative Draft)

This mapping is intentionally conservative. It separates mappings by confidence and avoids claiming certainty where the current repository is ambiguous.

## Exact mappings (safe)

| Legacy location | Canonical location | Rule | Confidence |
|---|---|---|---|
| `question.id` | `legacy_ids.id` | Copy as-is. | Exact |
| `question.number` | `legacy_ids.number` | Copy as-is (nullable). | Exact |
| `question.title` | `title` | Copy as-is. | Exact |
| `question.stem` | `stem` | Copy as-is. | Exact |
| `question.parts[]` | `parts[]` | Preserve part ordering. | Exact |
| `part.id` | `legacy_part_id` (or part provenance block) | Copy as-is for traceability. | Exact |
| `part.prompt` | `prompt` | Copy as-is. | Exact |
| `part.max_score` | `max_score` | Copy numeric value as-is. | Exact |
| `part.response_type` | `response_type` | Copy raw value; validate against canonical enum later. | Exact |
| `part.rubric[]` | `answer_key[]` | Copy content as-is. | Exact |
| `part.must_have[]` | `must_have_elements[]` | Copy array; default `[]` if absent. | Exact |
| `part.list_count` | `response_constraints.list_count_required` | Use only when `response_type = list`. | Exact |
| `part.single_line` | `response_constraints.single_line` | Boolean copy; default false if absent. | Exact |
| `question.stem_image` | `stem_assets[]` | Convert to image asset entry with `path = stem_image`. | Exact |

## Probable mappings (require policy confirmation)

| Legacy location | Candidate canonical location | Why probable | Caveat |
|---|---|---|---|
| `part.rc_classification` | `official_written_classification_code` | Numeric values likely intended as RC classification references. | Requires approved codebook mapping to canonical codes/labels. |
| `part.theme` | `official_topic_theme_code` | Values observed in A–F range, consistent with documented themes. | Must validate against taxonomy table and part/question level policy. |
| Form membership from `exam_forms.forms[].question_ids` | `form_eligibility.eligible_form_ids` | Directly expresses where question is currently used. | Needs policy for “eligible” vs “currently assigned.” |
| Parsed numeric from `question.id` | `legacy_ids.id_numeric` | Useful for collision detection and deterministic sort. | Ambiguous where zero-padded and non-padded IDs coexist. |

## Unknown / unsafe mappings (do not auto-map)

| Legacy location | Unsafe target | Why unsafe |
|---|---|---|
| `part.domain` (numeric) | `official_topic_theme_*` or `official_written_classification_*` | No authoritative crosswalk in repo; numeric domain meanings are mixed-era/ambiguous. |
| Missing `question.number` | `display_number` | No explicit ordering policy; inferring from file order may be unstable. |
| `response_type = haddon_matrix` with `haddon_time_as_rows` | Canonical matrix constraints | Canonical schema has no confirmed direct mapping spec for this custom structure yet. |
| `response_type = two_by_two_workspace` with workspace flags | Canonical response constraints | Structure semantics are unclear without explicit schema extension. |
| Missing source fields (question + part) | `source_profile` / `source_list` | Adding source attribution would be fabricated without evidence in data. |

## Notes for migration implementation
- Keep all raw legacy taxonomy fields in a provenance block until manual mapping is approved.
- Emit migration flags rather than forcing uncertain canonical values.
- Prefer null + review queue over speculative enrichment.
