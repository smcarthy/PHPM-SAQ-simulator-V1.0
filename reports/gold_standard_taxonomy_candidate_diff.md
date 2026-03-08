# Gold-Standard Taxonomy Candidate Diff

Source baseline: `content/gold_standard/royal_college_sample_saq_2025.json` (all taxonomy fields unresolved placeholders).

Candidate file: `content/gold_standard/royal_college_sample_saq_2025.taxonomy_candidate.json`.

## PHPM_SAQ_GS_0001

### Original unresolved fields
- Question-level written/theme: `requires_manual_classification` / `requires_manual_theme_assignment`
- Part-level written/theme (PA, PB): unresolved placeholders
- Simulator tags: empty

### Proposed candidate fields
- Question-level: written `MPP`; theme unresolved; tags `[]`
- Part PA: written `MPP`; theme unresolved; tags `[]`
- Part PB: written `MPP`; theme unresolved; tags `[]`

### Remaining unresolved issues
- Topic theme assignment remains unresolved at question and part levels.

---

## PHPM_SAQ_GS_0002

### Original unresolved fields
- Question-level and part-level written/theme unresolved placeholders
- Simulator tags empty

### Proposed candidate fields
- Question-level: written `HP`; theme `A`; tags `[communicable_diseases]`
- Part PA: written `HP`; theme `A`; tags `[communicable_diseases]`

### Remaining unresolved issues
- None in candidate pass.

---

## PHPM_SAQ_GS_0003

### Original unresolved fields
- Question-level and part-level written/theme unresolved placeholders
- Simulator tags empty

### Proposed candidate fields
- Question-level: written `HP`; theme `D`; tags `[environmental_health]`
- Part PA: written `HP`; theme `D`; tags `[environmental_health]`
- Part PB: written `HP`; theme `D`; tags `[environmental_health]`

### Remaining unresolved issues
- None in candidate pass.

---

## PHPM_SAQ_GS_0004

### Original unresolved fields
- Question-level and part-level written/theme unresolved placeholders
- Simulator tags empty

### Proposed candidate fields
- Question-level written: `mixed_part_level_assignment`
- Question-level theme: `E`; tags `[maternal_child_health]`
- Part PA: written `HPDP`; theme `E`; tags `[maternal_child_health]`
- Part PB: written `MPP` (medium confidence); theme `E`; tags `[maternal_child_health]`

### Remaining unresolved issues
- Human review advised for part PB written classification (MPP vs HPDP interpretation).

---

## PHPM_SAQ_GS_0005

### Original unresolved fields
- Question-level and part-level written/theme unresolved placeholders
- Simulator tags empty

### Proposed candidate fields
- Question-level: written `BS`; theme unresolved; tags `[]`
- Part PA: written `BS`; theme unresolved; tags `[]`

### Remaining unresolved issues
- Topic theme assignment remains unresolved at question and part levels.

---

## PHPM_SAQ_GS_0006

### Original unresolved fields
- Question-level and part-level written/theme unresolved placeholders
- Simulator tags empty

### Proposed candidate fields
- Question-level written: `mixed_part_level_assignment`
- Question-level theme: `B`; tags `[non_communicable_diseases]`
- Part PA: written `HPDP` (medium confidence); theme `B`; tags `[non_communicable_diseases]`
- Part PB: written unresolved; theme `B`; tags `[non_communicable_diseases]`
- Part PC: written unresolved; theme `B`; tags `[non_communicable_diseases]`

### Remaining unresolved issues
- Written classification for parts PB/PC unresolved (HS vs MPP vs HPDP plausible).
- Manual confirmation advised for part PA written classification.
