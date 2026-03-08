# PHPM SAQ Canonical Question Schema (Transition Baseline)

## Purpose
This document defines a canonical schema to support migration from legacy question objects toward a machine-friendly structure that preserves exam fidelity and supports future validator upgrades.

The style anchor for future question creation and validation is the **Royal College sample written exam material** to reduce drift in question format, multipart structure, directive verbs, and scoring style.

## Design Principles
- Support **question-level** and **part-level** metadata explicitly.
- Preserve backward compatibility with legacy identifiers and taxonomy fields.
- Enable a future compatibility normalizer (legacy → canonical).
- Keep schema deterministic for static-site/offline workflows.

---

## Canonical Question Object

```json
{
  "question_id": "Q-2026-001",
  "legacy_ids": {
    "id": "Q1",
    "number": 1
  },
  "status": "active",
  "title": "Question title",
  "stem": "Question stem text...",
  "stem_assets": [
    {
      "asset_id": "asset-1",
      "asset_type": "image",
      "path": "Q11table.png",
      "alt_text": "Reference table for calculations"
    }
  ],
  "version": "1.0.0",
  "change_log": [
    {
      "date": "2026-03-08",
      "author": "content-team",
      "change": "Initial canonical migration object."
    }
  ],
  "source_profile": {
    "source_type": "simulated_rc_style",
    "reference": "Royal College sample written exam material",
    "notes": "Use RC style for multipart structure and directive verbs."
  },
  "gold_standard_alignment_status": "aligned",
  "official_topic_theme_code": "A",
  "official_topic_theme_label": "Communicable Diseases",
  "simulator_topic_tags": [
    "communicable_diseases"
  ],
  "form_eligibility": {
    "include_in_full_exam": true,
    "eligible_form_ids": ["FORM-1"],
    "exclude_reasons": []
  },
  "time_estimate_minutes": 15,
  "difficulty_level": "moderate",
  "parts": [
    {
      "part_id": "Q-2026-001-P1",
      "part_letter": "a",
      "display_label": "a)",
      "prompt": "List three key interventions...",
      "instruction_verb": "list",
      "max_score": 3,
      "response_type": "list",
      "response_constraints": {
        "list_count_required": 3,
        "matrix_rows": null,
        "matrix_columns": null,
        "calculation_required": false,
        "single_line": false,
        "allow_partial_credit": true
      },
      "must_have_elements": [
        "Intervention 1",
        "Intervention 2"
      ],
      "answer_key": [
        "Model answer bullet 1",
        "Model answer bullet 2"
      ],
      "acceptable_alternatives": [
        "Equivalent phrasing accepted where conceptually correct"
      ],
      "scoring_notes": "Award 1 mark per distinct correct intervention.",
      "official_written_classification_code": "HPDP",
      "official_written_classification_label": "Intervention and Methods in Health Promotion and Disease Prevention",
      "official_topic_theme_code": "A",
      "official_topic_theme_label": "Communicable Diseases",
      "simulator_topic_tags": [
        "communicable_diseases"
      ],
      "source_list": [
        "Royal College sample written exam material"
      ],
      "last_validated_date": "2026-03-08",
      "validator": "initial-taxonomy-pass"
    }
  ]
}
```

---

## Required Question-Level Fields
- `question_id`
- `legacy_ids`
- `status`
- `title`
- `stem`
- `stem_assets`
- `version`
- `change_log`
- `source_profile`
- `gold_standard_alignment_status`
- `official_topic_theme_code`
- `official_topic_theme_label`
- `simulator_topic_tags`
- `form_eligibility`
- `time_estimate_minutes`
- `difficulty_level`
- `parts`

## Required Part-Level Fields
- `part_id`
- `part_letter`
- `display_label`
- `prompt`
- `instruction_verb`
- `max_score`
- `response_type`
- `response_constraints`
- `must_have_elements`
- `answer_key`
- `acceptable_alternatives`
- `scoring_notes`
- `official_written_classification_code`
- `official_written_classification_label`
- `official_topic_theme_code`
- `official_topic_theme_label`
- `simulator_topic_tags`
- `source_list`
- `last_validated_date`
- `validator`

## Response-Constraint Structure
`response_constraints` is designed to support structured prompt logic at subsection level (`a`, `b`, `c`, etc.) and includes:
- `list_count_required`
- `matrix_rows`
- `matrix_columns`
- `calculation_required`
- `single_line`
- `allow_partial_credit`

This allows precise machine validation while preserving rubric flexibility.

## Subsection Support (Multipart SAQ)
The schema explicitly models `parts` as first-class objects with their own taxonomy, scoring, and validation metadata. This supports realistic SAQ structure where part `a` and part `b` can differ in directive verb, scoring logic, and content-area classification.

## Migration and Backward Compatibility Notes
Current legacy fields can be mapped as follows (illustrative mapping):

- `id` → `legacy_ids.id`
- `number` → `legacy_ids.number`
- `theme` → `official_topic_theme_code` (when valid A–F)
- `rc_classification` → `official_written_classification_code` (via explicit codebook mapping)
- `domain` → transitional field only; requires explicit mapping table before canonical ingestion

During migration, legacy fields may remain present in source JSON for runtime compatibility, but canonical fields should be treated as the source of truth in future normalization/validation pipelines.

## Non-Goals for This Step
- No runtime wiring changes.
- No mutation of current `question_bank.json` objects.
- No rendering or exam-flow behavior changes.
