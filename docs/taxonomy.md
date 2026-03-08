# PHPM SAQ Canonical Taxonomy (Constitution-Aligned)

## Purpose
This document defines the canonical taxonomy policy for non-runtime migration artifacts. Runtime behavior remains unchanged; legacy runtime fields are still supported until a compatibility normalizer is introduced.

## Locked taxonomy policy
Per approved project constitution:

1. **Every question part must map to at least one official written classification**:
   - `PH`, `HS`, `BS`, `HPDP`, `HP`, `MPP`
2. **Every question part must map to at least one theme code**:
   - `A`, `B`, `C`, `D`, `E`, `F`, `G`
3. **Multi-label assignment is allowed** at question and part level.
4. **Primary vs secondary labels are required** in canonical artifacts.
5. **Blueprint counting rule**: the first value in `primary_written_classification_codes` is the default counting classification unless explicit policy later changes this.
6. **`G = Other` is theme-only** and cannot be used as a written-classification code.

## Canonical namespaces (`content/taxonomy.json`)

1. **`official_written_classifications`**
   - Official written-classification codebook with blueprint weight ranges.
   - Valid values: `PH`, `HS`, `BS`, `HPDP`, `HP`, `MPP`.

2. **`official_topic_themes`**
   - Official themes `A–F` plus simulator extension `G = Other`.
   - `G` is used when a part does not fit A–F cleanly and should remain explicit instead of forcing unsupported certainty.

3. **`simulator_tags`**
   - Stable machine-friendly tags for search/filtering and normalization workflows.

## Primary/secondary labeling model
For both question and part levels, taxonomy artifacts should use:

- `primary_written_classification_codes` (required, non-empty)
- `secondary_written_classification_codes` (optional)
- `primary_theme_codes` (required, non-empty)
- `secondary_theme_codes` (optional)

Part-level taxonomy remains authoritative. Question-level arrays should be inherited from parts where aligned, or recorded as mixed when parts differ.

## Transition/backward compatibility
Legacy singleton fields (for example `official_written_classification_code`, `official_topic_theme_code`, and historical fields such as `domain`/`theme`) may remain in transition artifacts for compatibility/tracing, but the canonical source of truth is the primary/secondary array model above.

## Implementation status
- Documentation/data artifact updates only.
- No runtime wiring changes.
- No changes to timers, local storage, review/submit, export, calculator, or rendering behavior.
