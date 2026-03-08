# PHPM SAQ Canonical Taxonomy (Transition Baseline)

## Purpose
This document defines the canonical taxonomy artifacts for the PHPM SAQ simulator transition state. During this phase, runtime behavior remains unchanged and legacy fields continue to function for backward compatibility.

The style anchor for future question creation and validation is the **Royal College sample written exam material** to reduce drift in question format, multipart structure, directive verbs, and scoring style.

## Canonical Namespaces
The canonical taxonomy is stored in `content/taxonomy.json` and contains three namespaces:

1. **`official_written_classifications`**
   - Represents official written content-area classifications (PH, HS, BS, HPDP, HP, MPP).
   - Includes official mark-weight ranges (`weight_min_percent`, `weight_max_percent`).
   - Intended primarily for scoring-aligned metadata, especially at **question-part level**.

2. **`official_topic_themes`**
   - Represents the six official topic themes (A–F).
   - Intended for topic-level categorization at both **question** and **question-part** levels.

3. **`simulator_tags`**
   - Represents normalized, machine-friendly tags used by simulator logic and UX filtering.
   - Includes required slugs for future targeted blocks:
     - `communicable_diseases`
     - `non_communicable_diseases`
     - `mental_health_substance_use`
     - `environmental_health`
     - `maternal_child_health`
     - `injury_voluntary_involuntary`

## Why Three Taxonomy Layers Exist
- **Official written classifications** are exam-blueprint content areas and include weight ranges.
- **Official topic themes** are broad topical categories for curriculum-aligned grouping.
- **Simulator tags** are implementation-level identifiers that remain stable for filtering, query logic, and data normalization.

These layers are related but not interchangeable:
- A question part can map to one official written classification while sharing a question-level official topic theme.
- Multiple simulator tags can coexist when a question crosses topic boundaries.

## Transition and Backward Compatibility
Legacy fields (for example `domain`, `theme`, and mixed usage of `rc_classification`) remain backward-compatible in current data and rendering while migration is ongoing.

However, these legacy fields are **not** the long-term source of truth unless explicitly mapped by a compatibility normalizer. The long-term source of truth is the canonical taxonomy in `content/taxonomy.json`.

## Guidance for Future Targeted Practice Blocks
Future 15-minute and 30-minute targeted practice blocks should use:
- `official_topic_themes` codes/labels, and/or
- `simulator_tags`

They should **not** depend on legacy `domain` codes.

## Implementation Status
- Added as schema and documentation artifact only.
- No current runtime wiring in `script.js` or form behavior changes.
- Existing simulator behavior (timers, local storage, review/submit, exports, calculator, rendering) remains unchanged.
