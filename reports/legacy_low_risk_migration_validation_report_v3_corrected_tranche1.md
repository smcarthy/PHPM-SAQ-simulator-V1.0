# Low-Risk Migration Candidate Validation Report

- Candidate file: `content/candidates/legacy_low_risk_migration_candidate_v3_corrected_tranche1.json`
- Questions validated: 5
- Validation status: PASS
- Error count: 0
- Warning count: 0

## Warning type counts
- multi_primary_theme_codes: 1
- multi_primary_written_codes: 1

## Checks run
- Selected-question count in allowed range (3-5).
- Canonical ID format checks for questions and parts.
- Mandatory question-level and part-level taxonomy array checks.
- Allowed taxonomy code-set checks against locked taxonomy policy.
- List response constraints checks for faithful list_count carry-forward.
- Locked source provenance policy check (`source_profile=needs_full_source_review` for all migrated items).
- Locked question rollup policy check (ordered union of part primaries + blueprint counting code).
