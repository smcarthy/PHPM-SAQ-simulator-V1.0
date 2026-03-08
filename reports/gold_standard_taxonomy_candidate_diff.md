# Gold-Standard Taxonomy Candidate Diff (Constitution-Aligned)

Source baseline: `content/gold_standard/royal_college_sample_saq_2025.json` (taxonomy placeholders unresolved).

Candidate file: `content/gold_standard/royal_college_sample_saq_2025.taxonomy_candidate.json` (primary/secondary taxonomy arrays populated).

## Net changes from baseline
- Added required taxonomy arrays at question and part level:
  - `primary_written_classification_codes`
  - `secondary_written_classification_codes`
  - `primary_theme_codes`
  - `secondary_theme_codes`
- Removed all required-field unresolved placeholders from part-level taxonomy.
- Introduced theme `G` usage where A–F fit was weak (Q1a, Q1b, Q5a).
- Added explicit multi-label written assignments in overlap parts (Q4b, Q6a, Q6b, Q6c).
- Preserved legacy singleton taxonomy fields as compatibility mirrors.

## Remaining unresolved issues
- No unresolved required taxonomy fields remain.
- Manual review remains for primary-vs-secondary preference in overlap parts only.
