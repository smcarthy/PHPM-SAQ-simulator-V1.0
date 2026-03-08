# PHPM SAQ Canonical Question Schema (Constitution-Aligned)

## Purpose
This document defines the canonical non-runtime schema used for taxonomy migration and gold-standard adjudication while preserving runtime backward compatibility.

## Design principles
- Part-level taxonomy is authoritative.
- Every part has at least one written classification and at least one theme.
- Multiple labels are supported with explicit primary vs secondary distinction.
- Question-level taxonomy reflects part-level rollup (inherited when aligned, mixed when not).

---

## Canonical taxonomy fields

### Question-level taxonomy fields
- `primary_written_classification_codes` (array, required, min length 1)
- `secondary_written_classification_codes` (array, optional)
- `primary_theme_codes` (array, required, min length 1)
- `secondary_theme_codes` (array, optional)

### Part-level taxonomy fields
- `primary_written_classification_codes` (array, required, min length 1)
- `secondary_written_classification_codes` (array, optional)
- `primary_theme_codes` (array, required, min length 1)
- `secondary_theme_codes` (array, optional)

Allowed code sets:
- Written classifications: `PH`, `HS`, `BS`, `HPDP`, `HP`, `MPP`
- Themes: `A`, `B`, `C`, `D`, `E`, `F`, `G` (`G` allowed only at theme layer)

Blueprint counting default:
- First value in `primary_written_classification_codes`.

---

## Canonical question object (taxonomy excerpt)

```json
{
  "question_id": "PHPM_SAQ_GS_0001",
  "primary_written_classification_codes": ["MPP"],
  "secondary_written_classification_codes": [],
  "primary_theme_codes": ["G"],
  "secondary_theme_codes": [],
  "parts": [
    {
      "part_id": "PHPM_SAQ_GS_0001_PA",
      "primary_written_classification_codes": ["MPP"],
      "secondary_written_classification_codes": [],
      "primary_theme_codes": ["G"],
      "secondary_theme_codes": []
    }
  ]
}
```

---

## Backward compatibility fields
For transition tooling, singleton mirror fields may still be present:
- `official_written_classification_code`
- `official_written_classification_label`
- `official_topic_theme_code`
- `official_topic_theme_label`

These are compatibility mirrors only; canonical adjudication should use primary/secondary arrays.

## Non-goals
- No runtime behavior changes.
- No updates to live `question_bank.json`, exam-flow rendering, scoring UX, or local-storage logic.
